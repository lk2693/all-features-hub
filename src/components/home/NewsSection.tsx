import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  published_at: string | null;
  created_at: string;
}

// Fallback data for when no news is in the database
const fallbackNews = [
  {
    id: "1",
    title: "Neue Förderrichtlinien für Kulturprojekte 2025",
    excerpt: "Die Stadt Braunschweig hat die neuen Förderrichtlinien veröffentlicht. Hier die wichtigsten Änderungen im Überblick.",
    slug: "neue-foerderrichtlinien-2025",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Kulturrat trifft sich zur Vollversammlung",
    excerpt: "Am 15. Februar findet die nächste Vollversammlung statt. Thema: Kulturentwicklungsplan 2030.",
    slug: "vollversammlung-februar-2025",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Erfolgreiche Kooperation mit dem Staatstheater",
    excerpt: "Das gemeinsame Projekt zur Nachwuchsförderung zeigt erste Erfolge. 15 junge Künstler:innen präsentieren ihre Arbeiten.",
    slug: "kooperation-staatstheater",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("news_posts")
          .select("id, title, excerpt, slug, published_at, created_at")
          .eq("is_published", true)
          .order("published_at", { ascending: false })
          .limit(3);

        if (error) throw error;
        
        // Use database news if available, otherwise use fallback
        setNews(data && data.length > 0 ? data : fallbackNews);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews(fallbackNews);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-gradient-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Aktuelles
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Neuigkeiten aus der Braunschweiger Kulturszene
            </p>
          </div>
          <Button variant="outline" asChild className="shrink-0">
            <Link to="/news">
              Alle News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter className="pt-0">
                  <Skeleton className="h-4 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {news.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <Link to={`/news/${item.slug}`} className="block h-full group">
                  <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <Badge variant="secondary" className="font-medium">
                          News
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(item.published_at || item.created_at)}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {item.excerpt || "Lesen Sie mehr über diesen Beitrag..."}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Weiterlesen
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
