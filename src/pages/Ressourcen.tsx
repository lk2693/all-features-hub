import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Search, Monitor, Home, Lightbulb, Music, Camera, Wrench, MapPin, User, ArrowRight, Plus, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ResourceRequestDialog } from "@/components/resources/ResourceRequestDialog";
import ressourcenHero from "@/assets/ressourcen-hero.jpg";

const categories = [
  { id: "alle", label: "Alle", icon: null },
  { id: "technik", label: "Technik", icon: Monitor },
  { id: "raeume", label: "Räume", icon: Home },
  { id: "knowhow", label: "Know-how", icon: Lightbulb },
  { id: "instrumente", label: "Instrumente", icon: Music },
  { id: "medien", label: "Medien", icon: Camera },
  { id: "werkzeuge", label: "Werkzeuge", icon: Wrench },
];

const categoryIconMap: Record<string, React.ElementType> = {
  technik: Monitor,
  raeume: Home,
  knowhow: Lightbulb,
  instrumente: Music,
  medien: Camera,
  werkzeuge: Wrench,
};

const categoryStyles: Record<string, string> = {
  technik: "bg-primary/10 text-primary",
  raeume: "bg-accent/30 text-accent-foreground",
  knowhow: "bg-secondary text-secondary-foreground",
  instrumente: "bg-primary/10 text-primary",
  medien: "bg-accent/30 text-accent-foreground",
  werkzeuge: "bg-secondary text-secondary-foreground",
};

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  provider_name: string;
  provider_email: string;
  location: string;
  is_available: boolean;
}

export default function Ressourcen() {
  const [selectedCategory, setSelectedCategory] = useState("alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestOpen, setRequestOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);

  useEffect(() => {
    async function fetchResources() {
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, description, category, provider_name, provider_email, location, is_available")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (error) console.error("Error fetching resources:", error);
      else setResources(data || []);
      setIsLoading(false);
    }
    fetchResources();
  }, []);

  const filteredResources = resources.filter((r) => {
    const matchesCategory = selectedCategory === "alle" || r.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.provider_name.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <img src={ressourcenHero} alt="Ressourcenpool" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />

        <div className="container relative z-10 pb-14 pt-36">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/90 text-primary-foreground mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Teilen & Nutzen
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Ressourcenpool
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-background/60 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Finde und teile Ressourcen mit anderen Kulturschaffenden – von Technik über Räume bis zu Know-how.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8"
          >
            <Link
              to="/ressourcen/eintragen"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-background text-foreground hover:bg-background/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Ressource eintragen
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border/50 sticky top-0 z-30 backdrop-blur-md bg-background/90">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {cat.icon && <cat.icon className="h-3.5 w-3.5" />}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border bg-card px-4 py-2 max-w-sm w-full transition-all duration-300",
                isFocused ? "border-primary/50 shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]" : "border-border"
              )}
            >
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                placeholder="Ressourcen suchen…"
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

      {/* Resources Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Ressourcen werden geladen…</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                {resources.length === 0 ? "Noch keine Ressourcen vorhanden" : "Keine Ressourcen gefunden"}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {resources.length === 0
                  ? "Tragen Sie die erste Ressource ein und helfen Sie der Community!"
                  : "Versuchen Sie eine andere Suche oder Kategorie."}
              </p>
              <Link
                to="/ressourcen/eintragen"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                Ressource eintragen
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource, index) => {
                const IconComponent = categoryIconMap[resource.category] || Monitor;
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                  >
                    <div className="group h-full flex flex-col rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300 overflow-hidden">
                      {/* Header with icon */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", categoryStyles[resource.category] || "bg-primary/10 text-primary")}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-medium",
                              resource.is_available
                                ? "border-primary/30 text-primary bg-primary/10"
                                : "border-muted-foreground/30 text-muted-foreground bg-muted/50"
                            )}
                          >
                            {resource.is_available ? "Verfügbar" : "Ausgeliehen"}
                          </Badge>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                          {resource.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto px-6 pb-6">
                        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground pb-4 border-b border-border/50">
                          <span className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{resource.provider_name}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{resource.location}</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setActiveResource(resource); setRequestOpen(true); }}
                          className="w-full flex items-center justify-between pt-4 text-sm font-medium text-primary opacity-80 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="flex items-center gap-1.5">
                            <Send className="h-3.5 w-3.5" />
                            Ressource anfragen
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <ResourceRequestDialog
        open={requestOpen}
        onOpenChange={setRequestOpen}
        resource={activeResource}
      />
    </Layout>
  );
}
