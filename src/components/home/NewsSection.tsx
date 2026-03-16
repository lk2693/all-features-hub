import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Calendar } from "lucide-react";
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

  const featured = news[0];
  const rest = news.slice(1);

  return (
    <section className="py-24 lg:py-36 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
        >
          <div>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
              Aktuelles
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Neuigkeiten aus der Kulturszene
            </p>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center gap-3 self-start sm:self-auto"
          >
            <span className="px-6 py-3 rounded-full bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors">
              Alle News
            </span>
            <span className="p-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>

        {!isLoading && (
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Featured large card */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:row-span-2"
              >
                <Link to={`/news/${featured.slug}`} className="group block h-full">
                  <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden">
                    {/* Image or gradient */}
                    {featured.cover_image_url ? (
                      <img
                        src={featured.cover_image_url}
                        alt={featured.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/30" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

                    {/* Arrow */}
                    <div className="absolute top-5 right-5 p-2.5 rounded-full bg-background/90 text-foreground opacity-80 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge
                          className={
                            featured.category === "foerderung"
                              ? "bg-warning/20 text-warning border-warning/30"
                              : "bg-background/20 text-background border-background/30"
                          }
                          variant="outline"
                        >
                          {categoryLabels[featured.category] || "News"}
                        </Badge>
                        <span className="text-xs text-background/60 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(featured.published_at || featured.created_at)}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl lg:text-3xl font-bold text-background leading-tight mb-2">
                        {featured.title}
                      </h3>
                      <p className="text-background/60 text-sm line-clamp-2">
                        {featured.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Smaller cards */}
            {rest.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <Link to={`/news/${item.slug}`} className="group block h-full">
                  <div className="h-full rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300">
                    <div className="flex flex-col sm:flex-row h-full">
                      {/* Image */}
                      <div className="sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden bg-muted/50 flex-shrink-0">
                        {item.cover_image_url ? (
                          <img
                            src={item.cover_image_url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full min-h-[160px] bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 flex items-center justify-center">
                            <span className="font-display text-5xl font-bold text-primary/10">
                              {categoryLabels[item.category]?.[0] || "N"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col justify-center flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className={
                              item.category === "foerderung"
                                ? "border-warning/30 text-warning"
                                : item.category === "blog"
                                ? "border-primary/30 text-primary"
                                : "border-border"
                            }
                          >
                            {categoryLabels[item.category] || "News"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(item.published_at || item.created_at)}
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
