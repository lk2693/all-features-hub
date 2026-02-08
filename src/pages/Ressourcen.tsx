import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Search, Filter, Monitor, Home, Lightbulb, Music, Camera, Wrench, MapPin, User, ArrowRight, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const categories = [
  { id: "alle", label: "Alle", icon: Filter },
  { id: "technik", label: "Technik", icon: Monitor },
  { id: "raeume", label: "Räume", icon: Home },
  { id: "knowhow", label: "Know-how", icon: Lightbulb },
  { id: "instrumente", label: "Instrumente", icon: Music },
  { id: "medien", label: "Medien", icon: Camera },
  { id: "werkzeuge", label: "Werkzeuge", icon: Wrench },
];

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  provider_name: string;
  provider_email: string;
  location: string;
  is_available: boolean;
  image_url: string | null;
}

const getCategoryIcon = (categoryId: string) => {
  const cat = categories.find((c) => c.id === categoryId);
  return cat?.icon || Filter;
};

export default function Ressourcen() {
  const [selectedCategory, setSelectedCategory] = useState("alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("resources")
      .select("id, title, description, category, provider_name, provider_email, location, is_available, image_url")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching resources:", error);
    } else {
      setResources(data || []);
    }
    setIsLoading(false);
  };

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "alle" || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.provider_name.toLowerCase().includes(searchQuery.toLowerCase());
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
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
          >
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                Ressourcenpool
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Finde und teile Ressourcen mit anderen Kulturschaffenden – von Technik über Räume bis zu Know-how und Werkzeugen.
              </p>
            </div>
            <Button className="bg-gradient-hero hover:opacity-90 shrink-0" asChild>
              <Link to="/ressourcen/eintragen">
                <Plus className="mr-2 h-4 w-4" />
                Ressource eintragen
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "gap-2",
                    selectedCategory === category.id && "bg-gradient-hero hover:opacity-90"
                  )}
                >
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm w-full lg:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ressourcen suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {resources.length === 0 
                  ? "Noch keine Ressourcen vorhanden." 
                  : "Keine Ressourcen gefunden."}
              </p>
              <Button asChild>
                <Link to="/ressourcen/eintragen">
                  <Plus className="mr-2 h-4 w-4" />
                  Erste Ressource eintragen
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource, index) => {
                const IconComponent = getCategoryIcon(resource.category);
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                  >
                    <Card className="h-full flex flex-col border-border/50 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                      {resource.image_url && (
                        <div className="relative h-40 overflow-hidden">
                          <img 
                            src={resource.image_url} 
                            alt={resource.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge 
                            variant={resource.is_available ? "default" : "secondary"}
                            className={cn(
                              "absolute top-3 right-3",
                              resource.is_available ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {resource.is_available ? "Verfügbar" : "Ausgeliehen"}
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          {!resource.image_url && (
                            <Badge 
                              variant={resource.is_available ? "default" : "secondary"}
                              className={cn(
                                resource.is_available ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                              )}
                            >
                              {resource.is_available ? "Verfügbar" : "Ausgeliehen"}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="font-display text-lg group-hover:text-primary transition-colors">
                          {resource.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">
                          {resource.description}
                        </p>
                        <div className="space-y-2 text-sm text-muted-foreground pt-4 border-t border-border">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 shrink-0" />
                            <span className="truncate">{resource.provider_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="truncate">{resource.location}</span>
                          </div>
                        </div>
                        <a 
                          href={`mailto:${resource.provider_email}?subject=Anfrage: ${encodeURIComponent(resource.title)}`}
                          className="mt-4"
                        >
                          <Button variant="ghost" className="w-full justify-between group-hover:text-primary">
                            Kontakt aufnehmen
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
