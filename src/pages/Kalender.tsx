import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Calendar, Clock, MapPin, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const eventTypes = ["Alle", "Sitzung", "Frist", "Networking", "Workshop", "Veranstaltung"];

const allEvents = [
  {
    id: 1,
    title: "Vollversammlung Kulturrat",
    description: "Thema: Kulturentwicklungsplan 2030. Alle Mitglieder sind eingeladen, mitzudiskutieren.",
    date: "15. Feb 2025",
    time: "18:00 - 21:00 Uhr",
    location: "Rathaus Braunschweig, Saal 1",
    type: "Sitzung",
    color: "bg-primary",
  },
  {
    id: 2,
    title: "Förderfrist: Kulturstiftung des Bundes",
    description: "Einreichfrist für das Programm 'Kultur in ländlichen Räumen'. Anträge online möglich.",
    date: "28. Feb 2025",
    time: "23:59 Uhr",
    location: "Online",
    type: "Frist",
    color: "bg-destructive",
  },
  {
    id: 3,
    title: "Netzwerktreffen Freie Szene",
    description: "Informeller Austausch für Künstler:innen und Kulturschaffende der freien Szene.",
    date: "5. März 2025",
    time: "19:00 - 22:00 Uhr",
    location: "LOT-Theater",
    type: "Networking",
    color: "bg-accent",
  },
  {
    id: 4,
    title: "Workshop: Förderanträge schreiben",
    description: "Praxisworkshop zum Verfassen erfolgreicher Förderanträge. Mit Beispielen und Übungen.",
    date: "12. März 2025",
    time: "14:00 - 17:00 Uhr",
    location: "Haus der Kulturen",
    type: "Workshop",
    color: "bg-secondary-foreground",
  },
  {
    id: 5,
    title: "AG Kulturpolitik",
    description: "Monatliches Treffen der AG Kulturpolitik. Thema: Stellungnahme zum Landeskulturplan.",
    date: "18. März 2025",
    time: "17:00 - 19:00 Uhr",
    location: "Online (Zoom)",
    type: "Sitzung",
    color: "bg-primary",
  },
  {
    id: 6,
    title: "Förderfrist: Niedersächsische Sparkassenstiftung",
    description: "Antragsschluss für Projekte im Bereich Musik und darstellende Kunst.",
    date: "31. März 2025",
    time: "12:00 Uhr",
    location: "Postalisch / Online",
    type: "Frist",
    color: "bg-destructive",
  },
  {
    id: 7,
    title: "Kulturpolitischer Empfang",
    description: "Jahresempfang des Kulturrats mit Vertretern aus Politik, Verwaltung und Kulturszene.",
    date: "10. April 2025",
    time: "18:00 - 21:00 Uhr",
    location: "Staatstheater Braunschweig",
    type: "Veranstaltung",
    color: "bg-accent",
  },
];

export default function Kalender() {
  const [selectedType, setSelectedType] = useState("Alle");

  const filteredEvents = selectedType === "Alle" 
    ? allEvents 
    : allEvents.filter((event) => event.type === selectedType);

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
              Veranstaltungskalender
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Alle wichtigen Termine: Sitzungen, Workshops, Netzwerktreffen und Förderfristen auf einen Blick.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    selectedType === type && "bg-gradient-hero hover:opacity-90"
                  )}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calendar List */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="border-border/50 hover:shadow-card transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Date indicator */}
                      <div className={cn("w-1 lg:w-2 lg:h-full rounded-full shrink-0 hidden lg:block", event.color)} />
                      
                      {/* Mobile indicator */}
                      <div className={cn("w-full h-1 rounded-full lg:hidden", event.color)} />

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              event.type === "Frist" && "border-destructive text-destructive",
                              event.type === "Sitzung" && "border-primary text-primary",
                              event.type === "Workshop" && "border-secondary-foreground text-secondary-foreground"
                            )}
                          >
                            {event.type}
                          </Badge>
                        </div>
                        <CardTitle className="font-display text-xl mb-2">
                          {event.title}
                        </CardTitle>
                        <p className="text-muted-foreground mb-4">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Keine Termine in dieser Kategorie.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
