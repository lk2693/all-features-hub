import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = ["Alle", "Förderung", "Termine", "Projekte", "Kulturpolitik"];

const allNews = [
  {
    id: 1,
    title: "Neue Förderrichtlinien für Kulturprojekte 2025",
    excerpt: "Die Stadt Braunschweig hat die neuen Förderrichtlinien veröffentlicht. Hier die wichtigsten Änderungen im Überblick für alle Kulturschaffenden.",
    date: "28. Jan 2025",
    category: "Förderung",
    slug: "neue-foerderrichtlinien-2025",
    featured: true,
  },
  {
    id: 2,
    title: "Kulturrat trifft sich zur Vollversammlung",
    excerpt: "Am 15. Februar findet die nächste Vollversammlung statt. Thema: Kulturentwicklungsplan 2030. Alle Mitglieder sind herzlich eingeladen.",
    date: "25. Jan 2025",
    category: "Termine",
    slug: "vollversammlung-februar-2025",
    featured: false,
  },
  {
    id: 3,
    title: "Erfolgreiche Kooperation mit dem Staatstheater",
    excerpt: "Das gemeinsame Projekt zur Nachwuchsförderung zeigt erste Erfolge. 15 junge Künstler:innen präsentieren ihre Arbeiten.",
    date: "20. Jan 2025",
    category: "Projekte",
    slug: "kooperation-staatstheater",
    featured: false,
  },
  {
    id: 4,
    title: "Stellungnahme zum Haushaltsentwurf 2025",
    excerpt: "Der Kulturrat Braunschweig nimmt Stellung zum städtischen Haushaltsentwurf und fordert eine Erhöhung des Kulturetats.",
    date: "15. Jan 2025",
    category: "Kulturpolitik",
    slug: "stellungnahme-haushalt-2025",
    featured: false,
  },
  {
    id: 5,
    title: "Workshop-Reihe startet im März",
    excerpt: "Förderanträge schreiben, Projektmanagement, Öffentlichkeitsarbeit – unsere beliebte Workshop-Reihe geht in die nächste Runde.",
    date: "10. Jan 2025",
    category: "Termine",
    slug: "workshop-reihe-maerz",
    featured: false,
  },
  {
    id: 6,
    title: "Neue Mitglieder im Kulturrat",
    excerpt: "Wir begrüßen fünf neue Mitgliedsinstitutionen im Kulturrat Braunschweig. Die Kulturlandschaft wächst weiter.",
    date: "5. Jan 2025",
    category: "Projekte",
    slug: "neue-mitglieder-2025",
    featured: false,
  },
];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNews = allNews.filter((item) => {
    const matchesCategory = selectedCategory === "Alle" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = filteredNews.find((item) => item.featured);
  const regularNews = filteredNews.filter((item) => !item.featured);

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
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    selectedCategory === category && "bg-gradient-hero hover:opacity-90"
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>

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
                        <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                        <Badge variant="outline">{featuredNews.category}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {featuredNews.date}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-4">
                        {featuredNews.title}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {featuredNews.excerpt}
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
                        <Badge variant="secondary">{item.category}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {item.date}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {item.excerpt}
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
        </div>
      </section>
    </Layout>
  );
}
