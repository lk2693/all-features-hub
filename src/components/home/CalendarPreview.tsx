import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const events = [
  {
    id: 1,
    title: "Vollversammlung Kulturrat",
    date: "15. Feb 2025",
    day: "15",
    weekday: "Sa",
    time: "18:00 Uhr",
    location: "Rathaus Braunschweig",
    type: "Sitzung",
    color: "bg-primary",
    badgeStyle: "border-primary/30 text-primary bg-primary/10",
  },
  {
    id: 2,
    title: "Förderfrist: Kulturstiftung des Bundes",
    date: "28. Feb 2025",
    day: "28",
    weekday: "Fr",
    time: "23:59 Uhr",
    location: "Online",
    type: "Frist",
    color: "bg-destructive",
    badgeStyle: "border-destructive/30 text-destructive bg-destructive/10",
  },
  {
    id: 3,
    title: "Netzwerktreffen Freie Szene",
    date: "5. März 2025",
    day: "05",
    weekday: "Mi",
    time: "19:00 Uhr",
    location: "LOT-Theater",
    type: "Networking",
    color: "bg-accent",
    badgeStyle: "border-accent text-accent-foreground bg-accent/30",
  },
  {
    id: 4,
    title: "Workshop: Förderanträge schreiben",
    date: "12. März 2025",
    day: "12",
    weekday: "Mi",
    time: "14:00 Uhr",
    location: "Haus der Kulturen",
    type: "Workshop",
    color: "bg-secondary-foreground",
    badgeStyle: "border-secondary-foreground/30 text-secondary-foreground bg-secondary/30",
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
          <Link
            to="/kalender"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
          >
            Zum Kalender
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid gap-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                to={`/kalender/${event.id}`}
                className="group flex gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300"
              >
                {/* Date block */}
                <div className="flex flex-col items-center justify-center shrink-0 w-14">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    {event.weekday}
                  </span>
                  <span className="font-display text-3xl font-bold text-foreground leading-none mt-0.5">
                    {event.day}
                  </span>
                  <div className={cn("w-6 h-1 rounded-full mt-2", event.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={cn("text-xs font-medium", event.badgeStyle)}>
                      {event.type}
                    </Badge>
                  </div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-1.5 text-sm text-muted-foreground">
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
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 self-center" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
