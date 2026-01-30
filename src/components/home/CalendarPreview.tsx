import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const events = [
  {
    id: 1,
    title: "Vollversammlung Kulturrat",
    date: "15. Feb 2025",
    time: "18:00 Uhr",
    location: "Rathaus Braunschweig",
    type: "Sitzung",
    color: "bg-primary",
  },
  {
    id: 2,
    title: "Förderfrist: Kulturstiftung des Bundes",
    date: "28. Feb 2025",
    time: "23:59 Uhr",
    location: "Online",
    type: "Frist",
    color: "bg-destructive",
  },
  {
    id: 3,
    title: "Netzwerktreffen Freie Szene",
    date: "5. März 2025",
    time: "19:00 Uhr",
    location: "LOT-Theater",
    type: "Networking",
    color: "bg-accent",
  },
  {
    id: 4,
    title: "Workshop: Förderanträge schreiben",
    date: "12. März 2025",
    time: "14:00 Uhr",
    location: "Haus der Kulturen",
    type: "Workshop",
    color: "bg-secondary-foreground",
  },
];

export default function CalendarPreview() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Nächste Termine
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Sitzungen, Veranstaltungen und Förderfristen
            </p>
          </div>
          <Button variant="outline" asChild className="shrink-0">
            <Link to="/kalender">
              Zum Kalender
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-4"
        >
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                to={`/kalender/${event.id}`}
                className="block group"
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 transition-all duration-300 hover:shadow-card hover:border-primary/20">
                  {/* Date indicator */}
                  <div className={cn("w-1 h-16 rounded-full shrink-0", event.color)} />
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-medium">
                        {event.type}
                      </Badge>
                    </div>
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
