import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface NewsPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  published_at: string | null;
  created_at: string;
}

// Fallback data when no news in database
const fallbackNews: NewsPost[] = [
  {
    id: "1",
    title: "Neue Förderrichtlinien für Kulturprojekte 2025",
    excerpt: "Die Stadt Braunschweig hat die neuen Förderrichtlinien veröffentlicht. Hier die wichtigsten Änderungen im Überblick für alle Kulturschaffenden.",
    slug: "neue-foerderrichtlinien-2025",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Kulturrat trifft sich zur Vollversammlung",
    excerpt: "Am 15. Februar findet die nächste Vollversammlung statt. Thema: Kulturentwicklungsplan 2030. Alle Mitglieder sind herzlich eingeladen.",
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function News() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("news_posts")
          .select("id, title, excerpt, slug, published_at, created_at")
          .eq("is_published", true)
          .order("published_at", { ascending: false });

        if (error) throw error;
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

  const filteredNews = news.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesSearch;
  });

  const featuredNews = filteredNews[0];
  const regularNews = filteredNews.slice(1);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              News & Aktuelles
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Neuigkeiten aus der Braunschweiger Kulturszene, kulturpolitische Entwicklungen und Informationen vom Kulturrat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-end">
            {/* Search */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          {isLoading ? (
            <>
              {/* Featured Skeleton */}
              <div className="mb-12">
                <Card className="overflow-hidden">
                  <div className="grid lg:grid-cols-2">
                    <Skeleton className="aspect-video lg:aspect-auto lg:h-full" />
                    <div className="p-8 space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Regular Skeletons */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-full" />
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
            </>
          ) : (
            <>
              {/* Featured Article */}
              {featuredNews && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <Link to={`/news/${featuredNews.slug}`} className="block group">
                    <Card className="overflow-hidden border-border/50 hover:shadow-card-hover transition-all duration-300">
                      <div className="grid lg:grid-cols-2">
                        <div className="aspect-video lg:aspect-auto bg-gradient-hero opacity-80" />
                        <div className="p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-primary text-primary-foreground">Aktuell</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(featuredNews.published_at || featuredNews.created_at)}
                            </span>
                          </div>
                          <h2 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-4">
                            {featuredNews.title}
                          </h2>
                          <p className="text-muted-foreground mb-6">
                            {featuredNews.excerpt || "Lesen Sie mehr über diesen Beitrag..."}
                          </p>
                          <span className="inline-flex items-center text-primary font-medium gap-2 group-hover:gap-3 transition-all">
                            Weiterlesen
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )}

              {/* Regular Articles */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={`/news/${item.slug}`} className="block h-full group">
                      <Card className="h-full flex flex-col border-border/50 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <Badge variant="secondary">News</Badge>
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
              </div>

              {filteredNews.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Keine Artikel gefunden.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
