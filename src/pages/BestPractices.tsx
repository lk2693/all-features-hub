import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Search, Filter } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface BestPractice {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  cover_image_url: string | null;
  author_name: string;
  published_at: string | null;
  created_at: string;
}

const categoryLabels: Record<string, string> = {
  allgemein: "Allgemein",
  foerderung: "Förderung",
  veranstaltung: "Veranstaltungen",
  kommunikation: "Kommunikation",
  organisation: "Organisation",
  recht: "Recht & Finanzen",
};

const categoryColors: Record<string, string> = {
  allgemein: "bg-muted text-muted-foreground",
  foerderung: "bg-primary/10 text-primary",
  veranstaltung: "bg-accent/10 text-accent-foreground",
  kommunikation: "bg-secondary text-secondary-foreground",
  organisation: "bg-primary/10 text-primary",
  recht: "bg-muted text-muted-foreground",
};

export default function BestPractices() {
  const [practices, setPractices] = useState<BestPractice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPractices() {
      try {
        const { data, error } = await supabase
          .from("best_practices")
          .select("id, title, slug, excerpt, category, cover_image_url, author_name, published_at, created_at")
          .eq("is_published", true)
          .order("sort_order", { ascending: true })
          .order("published_at", { ascending: false });

        if (error) throw error;
        setPractices(data || []);
      } catch (error) {
        console.error("Error fetching best practices:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPractices();
  }, []);

  const filteredPractices = practices.filter((practice) => {
    const matchesSearch =
      !searchQuery ||
      practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || practice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(practices.map((p) => p.category)));

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-4">
              Wissen teilen
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Best Practices
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Praxiserprobte Leitfäden und Tipps für Kulturschaffende – von Fördermittelakquise 
              über Veranstaltungsplanung bis hin zu rechtlichen Fragen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Leitfaden suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Alle
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {categoryLabels[category] || category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-16 md:py-20">
        <div className="container">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardHeader>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPractices.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                {searchQuery || selectedCategory
                  ? "Keine Ergebnisse gefunden"
                  : "Noch keine Leitfäden verfügbar"}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery || selectedCategory
                  ? "Versuchen Sie es mit anderen Suchbegriffen oder Kategorien."
                  : "Bald finden Sie hier praxiserprobte Tipps für Ihre Kulturarbeit."}
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredPractices.map((practice, index) => (
                <motion.div
                  key={practice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={`/best-practices/${practice.slug}`}>
                    <Card className="h-full group hover:shadow-card transition-all duration-300 overflow-hidden">
                      {practice.cover_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={practice.cover_image_url}
                            alt={practice.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <Badge
                          className={`w-fit text-xs ${categoryColors[practice.category] || categoryColors.allgemein}`}
                        >
                          {categoryLabels[practice.category] || practice.category}
                        </Badge>
                        <CardTitle className="font-display text-xl group-hover:text-primary transition-colors">
                          {practice.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {practice.excerpt && (
                          <p className="text-muted-foreground line-clamp-3 mb-4">
                            {practice.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {practice.author_name}
                          </span>
                          <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                            Lesen <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-section">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Wissen teilen
            </h2>
            <p className="text-muted-foreground mb-8">
              Sie haben Erfahrungen und Tipps, die anderen Kulturschaffenden helfen könnten? 
              Kontaktieren Sie uns – wir freuen uns über Ihre Beiträge!
            </p>
            <Button asChild>
              <Link to="/kontakt">Beitrag vorschlagen</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
