import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type NewsCategory = "news" | "foerderung" | "blog";

const categoryLabels: Record<NewsCategory, string> = {
  news: "News",
  foerderung: "Förderung",
  blog: "Blog",
};

interface NewsPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  published_at: string | null;
  created_at: string;
  category: NewsCategory;
  cover_image_url: string | null;
}

const fallbackNews: NewsPost[] = [
  {
    id: "1",
    title: "Neue Förderrichtlinien für Kulturprojekte 2025",
    excerpt: "Die Stadt hat die neuen Förderrichtlinien veröffentlicht. Die wichtigsten Änderungen im Überblick.",
    slug: "neue-foerderrichtlinien-2025",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    category: "foerderung",
    cover_image_url: null,
  },
  {
    id: "2",
    title: "Kulturrat trifft sich zur Vollversammlung",
    excerpt: "Am 15. Februar findet die nächste Vollversammlung statt. Thema: Kulturentwicklungsplan 2030.",
    slug: "vollversammlung-februar-2025",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    category: "news",
    cover_image_url: null,
  },
  {
    id: "3",
    title: "Erfolgreiche Kooperation mit dem Staatstheater",
    excerpt: "Das gemeinsame Projekt zur Nachwuchsförderung zeigt erste Erfolge.",
    slug: "kooperation-staatstheater",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    category: "blog",
    cover_image_url: null,
  },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("news_posts")
          .select("id, title, excerpt, slug, published_at, created_at, category, cover_image_url")
          .eq("is_published", true)
          .order("published_at", { ascending: false })
          .limit(3);
        if (error) throw error;
        setNews(data && data.length > 0 ? (data as NewsPost[]) : fallbackNews);
      } catch {
        setNews(fallbackNews);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 bg-muted/30 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
        >
          <div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Aktuelles
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Neuigkeiten aus der Kulturszene
            </p>
          </div>
          <Button variant="outline" size="lg" asChild className="shrink-0 group">
            <Link to="/news">
              Alle News
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {!isLoading && (
          <motion.div style={{ y: parallaxY }} className="grid gap-6 lg:grid-cols-3">
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: index * 0.12 }}
              >
                <Link to={`/news/${item.slug}`} className="block group h-full">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="h-full rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Image area or color bar */}
                    <div className="h-48 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary overflow-hidden">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-7xl font-bold text-primary/10">
                            {categoryLabels[item.category]?.[0] || "N"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge
                          variant="outline"
                          className={
                            item.category === "foerderung"
                              ? "border-warning text-warning"
                              : item.category === "blog"
                              ? "border-primary text-primary"
                              : ""
                          }
                        >
                          {categoryLabels[item.category] || "News"}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.published_at || item.created_at)}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {item.excerpt || "Lesen Sie mehr..."}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
