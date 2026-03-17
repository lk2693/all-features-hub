import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { ExternalLink, Calendar, Euro, Search, ArrowRight, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCMSContent } from "@/hooks/useCMSContent";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import foerderungHero from "@/assets/foerderung-hero.jpg";

const categories = ["Alle", "Stiftungen", "Öffentlich", "Stipendien", "Ausschreibungen"];

const categoryBadgeStyles: Record<string, string> = {
  Stiftungen: "border-primary/30 text-primary bg-primary/10",
  "Öffentlich": "border-accent text-accent-foreground bg-accent/30",
  Stipendien: "border-secondary-foreground/30 text-secondary-foreground bg-secondary/30",
  Ausschreibungen: "border-destructive/30 text-destructive bg-destructive/10",
};

const foerderungen = [
  {
    id: 1,
    title: "Kulturstiftung des Bundes",
    description: "Fördert innovative Projekte und Vorhaben im internationalen Kontext. Verschiedene Programme mit unterschiedlichen Schwerpunkten.",
    category: "Stiftungen",
    deadline: "28. Feb 2025",
    amount: "10.000 - 500.000 €",
    link: "https://www.kulturstiftung-des-bundes.de",
    highlight: true,
  },
  {
    id: 2,
    title: "Stadt Braunschweig - Projektförderung Kultur",
    description: "Förderung von Kulturprojekten in Braunschweig. Anträge vierteljährlich möglich.",
    category: "Öffentlich",
    deadline: "Laufend (quartalsweise)",
    amount: "bis 10.000 €",
    link: "https://www.braunschweig.de/kultur",
    highlight: false,
  },
  {
    id: 3,
    title: "Niedersächsische Sparkassenstiftung",
    description: "Förderschwerpunkte: Musik, Bildende Kunst, Darstellende Kunst, Literatur, Denkmalschutz.",
    category: "Stiftungen",
    deadline: "31. März 2025",
    amount: "2.500 - 25.000 €",
    link: "https://www.nsks.de",
    highlight: false,
  },
  {
    id: 4,
    title: "Stipendium: Junge Kunst Niedersachsen",
    description: "Arbeitsstipendien für junge Künstler:innen bis 35 Jahre mit Wohnsitz in Niedersachsen.",
    category: "Stipendien",
    deadline: "15. April 2025",
    amount: "12.000 € (12 Monate)",
    link: "#",
    highlight: false,
  },
  {
    id: 5,
    title: "Fonds Soziokultur",
    description: "Bundesweite Förderung soziokultureller Projekte. Fokus auf Partizipation und kulturelle Bildung.",
    category: "Stiftungen",
    deadline: "1. Mai 2025",
    amount: "3.000 - 30.000 €",
    link: "https://www.fonds-soziokultur.de",
    highlight: false,
  },
  {
    id: 6,
    title: "Ausschreibung: Kunst im öffentlichen Raum",
    description: "Wettbewerb zur Gestaltung des neuen Kulturquartiers. Offen für Künstler:innen aller Sparten.",
    category: "Ausschreibungen",
    deadline: "30. Juni 2025",
    amount: "bis 50.000 €",
    link: "#",
    highlight: true,
  },
];

interface FoerderNews {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  published_at: string | null;
  created_at: string;
}

export default function Foerderung() {
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [foerderNews, setFoerderNews] = useState<FoerderNews[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const { content: heroContent } = useCMSContent("foerderung_hero");
  const { content: tippContent } = useCMSContent("foerderung_tipp");

  useEffect(() => {
    async function fetchFoerderNews() {
      try {
        const { data, error } = await supabase
          .from("news_posts")
          .select("id, title, excerpt, slug, published_at, created_at")
          .eq("is_published", true)
          .eq("category", "foerderung")
          .order("published_at", { ascending: false })
          .limit(3);
        if (error) throw error;
        setFoerderNews(data || []);
      } catch (error) {
        console.error("Error fetching foerder news:", error);
      } finally {
        setIsLoadingNews(false);
      }
    }
    fetchFoerderNews();
  }, []);

  const filteredFoerderungen = foerderungen.filter((item) => {
    const matchesCategory = selectedCategory === "Alle" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <img src={foerderungHero} alt="Förderung" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />

        <div className="container relative z-10 pb-14 pt-36">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/90 text-primary-foreground mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Förderung
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {heroContent.title || "Förderung & Finanzierung"}
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-background/60 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {heroContent.subtitle || "Fördermöglichkeiten, Stipendien und Ausschreibungen für Kulturschaffende in Braunschweig und Niedersachsen."}
          </motion.p>
        </div>
      </section>

      {/* Tipp Banner */}
      <section className="py-4 bg-primary/5 border-b border-primary/10">
        <div className="container">
          <div className="flex items-center gap-3 text-sm">
            <Lightbulb className="h-4 w-4 text-primary shrink-0" />
            <span className="font-medium text-foreground">{tippContent.title}:</span>
            <span className="text-muted-foreground">
              {tippContent.subtitle}
              {tippContent.cta_link && tippContent.cta_text && (
                <Link to={tippContent.cta_link} className="text-primary hover:underline ml-1 font-medium">
                  {tippContent.cta_text}
                </Link>
              )}
            </span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-background border-b border-border/50 sticky top-0 z-30 backdrop-blur-md bg-background/90">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div
              className={cn(
                "flex items-center gap-2 rounded-full border bg-card px-4 py-2 max-w-sm w-full transition-all duration-300",
                isFocused ? "border-primary/50 shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]" : "border-border"
              )}
            >
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                placeholder="Förderung suchen…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-0.5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Förder-News */}
      {(isLoadingNews || foerderNews.length > 0) && (
        <section className="py-14 bg-muted/20">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground">Aktuelle Fördernews</h2>
              <Link
                to="/news"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                Alle News
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {isLoadingNews ? (
              <div className="grid gap-5 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-border/50 bg-card p-6">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-3">
                {foerderNews.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                  >
                    <Link to={`/news/${news.slug}`} className="group block h-full">
                      <div className="h-full rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="border-warning/30 text-warning bg-warning/10 text-xs">
                            Fördernews
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(news.published_at || news.created_at).toLocaleDateString("de-DE")}
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {news.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {news.excerpt || "Lesen Sie mehr..."}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Weiterlesen
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Funding List */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container max-w-4xl">
          <div className="space-y-4">
            {filteredFoerderungen.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <div
                  className={cn(
                    "group rounded-2xl border bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300 p-5 sm:p-6",
                    item.highlight ? "border-primary/20 ring-1 ring-primary/10" : "border-border/50"
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs font-medium", categoryBadgeStyles[item.category] || "border-border")}
                        >
                          {item.category}
                        </Badge>
                        {item.highlight && (
                          <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
                            Empfohlen
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span className="font-medium text-foreground">{item.deadline}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Euro className="h-3.5 w-3.5 text-primary" />
                          <span className="font-medium text-foreground">{item.amount}</span>
                        </span>
                      </div>
                    </div>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
                    >
                      Zur Website
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredFoerderungen.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">Keine Förderungen gefunden</h2>
              <p className="text-muted-foreground">Versuchen Sie eine andere Suche oder Kategorie.</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
