import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { de } from "date-fns/locale";
import Layout from "@/components/layout/Layout";
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCMSContent } from "@/hooks/useCMSContent";
import { supabase } from "@/integrations/supabase/client";
import kalenderHero from "@/assets/kalender-hero.jpg";

const eventCategories = [
  { value: "alle", label: "Alle" },
  { value: "sitzung", label: "Sitzung" },
  { value: "frist", label: "Frist" },
  { value: "networking", label: "Networking" },
  { value: "workshop", label: "Workshop" },
  { value: "veranstaltung", label: "Veranstaltung" },
];

const categoryColors: Record<string, string> = {
  sitzung: "bg-primary",
  frist: "bg-destructive",
  networking: "bg-accent",
  workshop: "bg-secondary-foreground",
  veranstaltung: "bg-primary",
};

const categoryBadgeStyles: Record<string, string> = {
  sitzung: "border-primary/30 text-primary bg-primary/10",
  frist: "border-destructive/30 text-destructive bg-destructive/10",
  networking: "border-accent text-accent-foreground bg-accent/30",
  workshop: "border-secondary-foreground/30 text-secondary-foreground bg-secondary/30",
  veranstaltung: "border-primary/30 text-primary bg-primary/10",
};

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_all_day: boolean;
  category: string;
  organizer: string | null;
  website_url: string | null;
}

function formatEventDate(startDate: string): string {
  return format(parseISO(startDate), "d. MMMM yyyy", { locale: de });
}

function formatEventTime(startDate: string, endDate: string | null, isAllDay: boolean): string {
  if (isAllDay) return "Ganztägig";
  const start = parseISO(startDate);
  const startTime = format(start, "HH:mm", { locale: de });
  if (endDate) {
    const end = parseISO(endDate);
    return `${startTime} – ${format(end, "HH:mm", { locale: de })} Uhr`;
  }
  return `${startTime} Uhr`;
}

function formatDayNumber(startDate: string): string {
  return format(parseISO(startDate), "dd", { locale: de });
}

function formatDayName(startDate: string): string {
  return format(parseISO(startDate), "EEE", { locale: de });
}

export default function Kalender() {
  const [selectedCategory, setSelectedCategory] = useState("alle");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { content: heroContent } = useCMSContent("kalender_hero");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", currentMonth],
    queryFn: async () => {
      const startOfCurrentMonth = startOfMonth(currentMonth);
      const endOfCurrentMonth = endOfMonth(addMonths(currentMonth, 2));

      const { data, error } = await supabase
        .from("events")
        .select("id, title, description, location, start_date, end_date, is_all_day, category, organizer, website_url")
        .eq("is_published", true)
        .gte("start_date", startOfCurrentMonth.toISOString())
        .lte("start_date", endOfCurrentMonth.toISOString())
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });

  const filteredEvents = selectedCategory === "alle"
    ? events
    : events.filter((event) => event.category === selectedCategory);

  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const monthKey = format(parseISO(event.start_date), "MMMM yyyy", { locale: de });
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <img
          src={kalenderHero}
          alt="Kulturkalender"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />

        <div className="container relative z-10 pb-14 pt-36">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/90 text-primary-foreground mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Kalender
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {heroContent.title || "Termine & Veranstaltungen"}
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-background/60 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {heroContent.subtitle || "Sitzungen, Veranstaltungen und Förderfristen auf einen Blick."}
          </motion.p>
        </div>
      </section>

      {/* Filters & Month Navigation */}
      <section className="py-6 bg-background border-b border-border/50 sticky top-0 z-30 backdrop-blur-md bg-background/90">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Month Navigation */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="rounded-full h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-display text-lg font-semibold min-w-[180px] text-center capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: de })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="rounded-full h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {eventCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                    selectedCategory === cat.value
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Termine werden geladen…</p>
            </div>
          ) : Object.keys(groupedEvents).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                Keine Termine gefunden
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {selectedCategory !== "alle"
                  ? "In dieser Kategorie gibt es aktuell keine Termine."
                  : "Aktuell sind keine Termine geplant. Schauen Sie später wieder vorbei!"}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-14">
              {Object.entries(groupedEvents).map(([monthKey, monthEvents]) => (
                <div key={monthKey}>
                  <motion.h2
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="font-display text-sm font-semibold uppercase tracking-widest text-primary mb-6 capitalize"
                  >
                    {monthKey}
                  </motion.h2>

                  <div className="space-y-3">
                    {monthEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className="group flex gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300">
                          {/* Date block */}
                          <div className="flex flex-col items-center justify-center shrink-0 w-14">
                            <span className="text-xs font-medium text-muted-foreground uppercase">
                              {formatDayName(event.start_date)}
                            </span>
                            <span className="font-display text-3xl font-bold text-foreground leading-none mt-0.5">
                              {formatDayNumber(event.start_date)}
                            </span>
                            <div className={cn("w-6 h-1 rounded-full mt-2", categoryColors[event.category] || "bg-primary")} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium",
                                  categoryBadgeStyles[event.category] || "border-primary/30 text-primary bg-primary/10"
                                )}
                              >
                                {eventCategories.find((c) => c.value === event.category)?.label || event.category}
                              </Badge>
                              {event.organizer && (
                                <span className="text-xs text-muted-foreground">
                                  von {event.organizer}
                                </span>
                              )}
                            </div>
                            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {event.title}
                            </h3>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {formatEventTime(event.start_date, event.end_date, event.is_all_day)}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                            {event.website_url && (
                              <a
                                href={event.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline"
                              >
                                Weitere Infos
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
