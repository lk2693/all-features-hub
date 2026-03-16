import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import newsHero from "@/assets/news-hero.jpg";

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
    excerpt: "Die Stadt Braunschweig hat die neuen Förderrichtlinien veröffentlicht. Hier die wichtigsten Änderungen im Überblick für alle Kulturschaffenden.",
    slug: "neue-foerderrichtlinien-2025",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    category: "foerderung",
    cover_image_url: null,
  },
  {
    id: "2",
    title: "Kulturrat trifft sich zur Vollversammlung",
    excerpt: "Am 15. Februar findet die nächste Vollversammlung statt. Thema: Kulturentwicklungsplan 2030. Alle Mitglieder sind herzlich eingeladen.",
    slug: "vollversammlung-februar-2025",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    category: "news",
    cover_image_url: null,
  },
  {
    id: "3",
    title: "Erfolgreiche Kooperation mit dem Staatstheater",
    excerpt: "Das gemeinsame Projekt zur Nachwuchsförderung zeigt erste Erfolge. 15 junge Künstler:innen präsentieren ihre Arbeiten.",
    slug: "kooperation-staatstheater",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    category: "blog",
    cover_image_url: null,
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
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("news_posts")
          .select("id, title, excerpt, slug, published_at, created_at, category, cover_image_url")
          .eq("is_published", true)
          .order("published_at", { ascending: false });

        if (error) throw error;
        setNews(data && data.length > 0 ? (data as NewsPost[]) : fallbackNews);
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
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <img
          src={newsHero}
          alt="News & Aktuelles"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />

        <div className="container relative z-10 pb-14 pt-36">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/90 text-primary-foreground mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Aktuelles
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            News & Aktuelles
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-background/60 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Neuigkeiten aus der Braunschweiger Kulturszene, kulturpolitische Entwicklungen und Informationen vom Kulturrat.
          </motion.p>
        </div>
      </section>

      {/* Search bar */}
      <section className="py-8 bg-background">
        <div className="container">
          <div
            className={`flex items-center gap-2 rounded-full border bg-card px-4 py-2 max-w-md transition-all duration-300 ${
              isFocused
                ? "border-primary/50 shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                : "border-border"
            }`}
          >
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              placeholder="Artikel durchsuchen…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-1"
            />
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="space-y-8">
              <Skeleton className="w-full h-80 rounded-2xl" />
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-72 rounded-2xl" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredNews && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-10"
                >
                  <Link to={`/news/${featuredNews.slug}`} className="group block">
                    <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 hover:shadow-glow transition-all duration-300">
                      <div className="grid lg:grid-cols-2">
                        {/* Image */}
                        <div className="aspect-video lg:aspect-auto lg:min-h-[320px] bg-muted/50 overflow-hidden">
                          {featuredNews.cover_image_url ? (
                            <img
                              src={featuredNews.cover_image_url}
                              alt={featuredNews.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 flex items-center justify-center">
                              <span className="font-display text-8xl font-bold text-primary/10">
                                {categoryLabels[featuredNews.category]?.[0] || "N"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-8 lg:p-10 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-5">
                            <Badge
                              className={
                                featuredNews.category === "foerderung"
                                  ? "bg-warning/10 text-warning border-warning/30"
                                  : "bg-primary/10 text-primary border-primary/30"
                              }
                              variant="outline"
                            >
                              {categoryLabels[featuredNews.category] || "News"}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              {formatDate(featuredNews.published_at || featuredNews.created_at)}
                            </span>
                          </div>
                          <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-4 leading-tight">
                            {featuredNews.title}
                          </h2>
                          <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                            {featuredNews.excerpt || "Lesen Sie mehr über diesen Beitrag..."}
                          </p>
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                            Weiterlesen
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Regular Articles */}
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {regularNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <Link to={`/news/${item.slug}`} className="group block h-full">
                      <div className="h-full rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300">
                        {/* Image */}
                        <div className="aspect-[16/10] overflow-hidden bg-muted/50">
                          {item.cover_image_url ? (
                            <img
                              src={item.cover_image_url}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 flex items-center justify-center">
                              <span className="font-display text-6xl font-bold text-primary/10">
                                {categoryLabels[item.category]?.[0] || "N"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-3">
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
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(item.published_at || item.created_at)}
                            </span>
                          </div>
                          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {item.excerpt || "Lesen Sie mehr über diesen Beitrag..."}
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Weiterlesen
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {filteredNews.length === 0 && (
                <div className="text-center py-16">
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
