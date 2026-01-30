import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Search, Filter, Monitor, Home, Lightbulb, Music, Camera, Wrench, MapPin, User, ArrowRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const resources = [
  {
    id: 1,
    title: "PA-Anlage für Veranstaltungen",
    description: "Komplette PA-Anlage mit 2x 500W Tops, Subwoofer, Mischpult und Mikrofonen. Ideal für kleine bis mittlere Events.",
    category: "technik",
    provider: "Kulturzentrum Brunsviga",
    location: "Karlstraße 35",
    available: true,
  },
  {
    id: 2,
    title: "Proberaum für Bands",
    description: "Schallgedämmter Proberaum, 30qm, mit Grundausstattung (Drumkit, Verstärker). Stundenbuchung möglich.",
    category: "raeume",
    provider: "Musikschule Braunschweig",
    location: "Am Magnitor 14",
    available: true,
  },
  {
    id: 3,
    title: "Beratung Fördermittel",
    description: "Kostenlose Erstberatung zu Fördermöglichkeiten für Kulturprojekte. Termine nach Vereinbarung.",
    category: "knowhow",
    provider: "Kulturrat Braunschweig",
    location: "Online / Vor Ort",
    available: true,
  },
  {
    id: 4,
    title: "E-Piano Yamaha CLP-745",
    description: "Hochwertiges Digitalpiano, transportabel. Für Konzerte und Proben ausleihbar.",
    category: "instrumente",
    provider: "Jazz Club Braunschweig",
    location: "Schloßstraße 8",
    available: false,
  },
  {
    id: 5,
    title: "Foto- und Videokamera Kit",
    description: "Sony A7III mit Objektiven, LED-Lichtern und Stativ. Für Dokumentation und Werbematerial.",
    category: "medien",
    provider: "HBK Braunschweig",
    location: "Johannes-Selenka-Platz 1",
    available: true,
  },
  {
    id: 6,
    title: "Beamer HD 5000 Lumen",
    description: "Heller HD-Beamer für Präsentationen und Screenings. Inkl. Leinwand 3x2m.",
    category: "technik",
    provider: "VHS Braunschweig",
    location: "Alte Waage 15",
    available: true,
  },
  {
    id: 7,
    title: "Werkzeugkoffer Veranstaltungstechnik",
    description: "Akkuschrauber, Gaffer Tape, Kabelbinder, Scheinwerferhalterungen, etc.",
    category: "werkzeuge",
    provider: "LOT-Theater",
    location: "Kaffeetwete 4a",
    available: true,
  },
  {
    id: 8,
    title: "Atelier / Ausstellungsraum",
    description: "80qm Raum mit Tageslicht, geeignet für Workshops, kleine Ausstellungen oder kreatives Arbeiten.",
    category: "raeume",
    provider: "Kunstverein Braunschweig",
    location: "Lessingplatz 12",
    available: true,
  },
];

const getCategoryIcon = (categoryId: string) => {
  const cat = categories.find((c) => c.id === categoryId);
  return cat?.icon || Filter;
};

export default function Ressourcen() {
  const [selectedCategory, setSelectedCategory] = useState("alle");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "alle" || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.provider.toLowerCase().includes(searchQuery.toLowerCase());
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
                  <Card className="h-full flex flex-col border-border/50 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <Badge 
                          variant={resource.available ? "default" : "secondary"}
                          className={cn(
                            resource.available ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                          )}
                        >
                          {resource.available ? "Verfügbar" : "Ausgeliehen"}
                        </Badge>
                      </div>
                      <CardTitle className="font-display text-lg group-hover:text-primary transition-colors">
                        {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {resource.description}
                      </p>
                      <div className="space-y-2 text-sm text-muted-foreground pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 shrink-0" />
                          <span className="truncate">{resource.provider}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">{resource.location}</span>
                        </div>
                      </div>
                      <Button variant="ghost" className="mt-4 w-full justify-between group-hover:text-primary">
                        Details & Kontakt
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Keine Ressourcen gefunden.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
