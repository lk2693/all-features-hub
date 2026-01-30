import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { ExternalLink, Calendar, Euro, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCMSContent } from "@/hooks/useCMSContent";
import { Link } from "react-router-dom";

const categories = ["Alle", "Stiftungen", "Öffentlich", "Stipendien", "Ausschreibungen"];

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

export default function Foerderung() {
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");
  const { content: heroContent } = useCMSContent("foerderung_hero");
  const { content: tippContent } = useCMSContent("foerderung_tipp");

  const filteredFoerderungen = foerderungen.filter((item) => {
    const matchesCategory = selectedCategory === "Alle" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              {heroContent.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {heroContent.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-8 bg-accent/20 border-b border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <span className="font-display font-semibold text-foreground">{tippContent.title}:</span>
            <p className="text-muted-foreground">
              {tippContent.subtitle}
              {tippContent.cta_link && tippContent.cta_text && (
                <Link to={tippContent.cta_link} className="text-primary hover:underline ml-1">
                  {tippContent.cta_text}
                </Link>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6">
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

            <div className="relative max-w-sm w-full lg:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Förderung suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Funding List */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <div className="space-y-6">
            {filteredFoerderungen.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className={cn(
                  "border-border/50 hover:shadow-card transition-all duration-300",
                  item.highlight && "ring-2 ring-primary/20"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge variant="outline">{item.category}</Badge>
                          {item.highlight && (
                            <Badge className="bg-primary text-primary-foreground">Empfohlen</Badge>
                          )}
                        </div>
                        <CardTitle className="font-display text-xl mb-2">
                          {item.title}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <Button className="bg-gradient-hero hover:opacity-90">
                          Zur Website
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span><strong>Frist:</strong> {item.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Euro className="h-4 w-4 text-primary" />
                        <span><strong>Fördervolumen:</strong> {item.amount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFoerderungen.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Keine Förderungen gefunden.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
