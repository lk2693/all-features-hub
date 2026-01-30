import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, isSameMonth, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";
import { de } from "date-fns/locale";
import Layout from "@/components/layout/Layout";
import { Calendar as CalendarIcon, Clock, MapPin, Filter, ChevronLeft, ChevronRight, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCMSContent } from "@/hooks/useCMSContent";
import { supabase } from "@/integrations/supabase/client";

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

const categoryBorderColors: Record<string, string> = {
  sitzung: "border-primary text-primary",
  frist: "border-destructive text-destructive",
  networking: "border-accent text-accent-foreground",
  workshop: "border-secondary-foreground text-secondary-foreground",
  veranstaltung: "border-primary text-primary",
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

function formatEventDate(startDate: string, endDate: string | null, isAllDay: boolean): string {
  const start = parseISO(startDate);
  
  if (isAllDay) {
    return format(start, "d. MMMM yyyy", { locale: de });
  }
  
  return format(start, "d. MMMM yyyy", { locale: de });
}

function formatEventTime(startDate: string, endDate: string | null, isAllDay: boolean): string {
  if (isAllDay) {
    return "Ganztägig";
  }
  
  const start = parseISO(startDate);
  const startTime = format(start, "HH:mm", { locale: de });
  
  if (endDate) {
    const end = parseISO(endDate);
    const endTime = format(end, "HH:mm", { locale: de });
    return `${startTime} - ${endTime} Uhr`;
  }
  
  return `${startTime} Uhr`;
}

export default function Kalender() {
  const [selectedCategory, setSelectedCategory] = useState("alle");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { content: heroContent } = useCMSContent("kalender_hero");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", currentMonth],
    queryFn: async () => {
      const startOfCurrentMonth = startOfMonth(currentMonth);
      const endOfCurrentMonth = endOfMonth(addMonths(currentMonth, 2)); // Fetch 3 months

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

  // Group events by month
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const monthKey = format(parseISO(event.start_date), "MMMM yyyy", { locale: de });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

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

      {/* Filters & Navigation */}
      <section className="py-6 bg-background border-b border-border">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[160px] text-center">
                {format(currentMonth, "MMMM yyyy", { locale: de })}
              </span>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-muted-foreground hidden sm:block" />
              <div className="flex flex-wrap gap-2">
                {eventCategories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.value)}
                    className={cn(
                      selectedCategory === cat.value && "bg-gradient-hero hover:opacity-90"
                    )}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : Object.keys(groupedEvents).length === 0 ? (
            <div className="text-center py-16">
              <CalendarIcon className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                Keine Termine gefunden
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {selectedCategory !== "alle"
                  ? "In dieser Kategorie gibt es aktuell keine Termine."
                  : "Aktuell sind keine Termine geplant. Schauen Sie später wieder vorbei!"}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedEvents).map(([monthKey, monthEvents]) => (
                <div key={monthKey}>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6 capitalize">
                    {monthKey}
                  </h2>
                  <div className="space-y-4">
                    {monthEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <Card className="border-border/50 hover:shadow-card transition-all duration-300">
                          <CardHeader className="pb-2">
                            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                              {/* Date indicator */}
                              <div
                                className={cn(
                                  "w-1 lg:w-2 lg:h-full rounded-full shrink-0 hidden lg:block",
                                  categoryColors[event.category] || "bg-primary"
                                )}
                              />

                              {/* Mobile indicator */}
                              <div
                                className={cn(
                                  "w-full h-1 rounded-full lg:hidden",
                                  categoryColors[event.category] || "bg-primary"
                                )}
                              />

                              {/* Content */}
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      categoryBorderColors[event.category] || "border-primary text-primary"
                                    )}
                                  >
                                    {eventCategories.find((c) => c.value === event.category)?.label || event.category}
                                  </Badge>
                                  {event.organizer && (
                                    <span className="text-sm text-muted-foreground">
                                      von {event.organizer}
                                    </span>
                                  )}
                                </div>
                                <CardTitle className="font-display text-xl mb-2">
                                  {event.title}
                                </CardTitle>
                                {event.description && (
                                  <p className="text-muted-foreground mb-4">
                                    {event.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1.5">
                                    <CalendarIcon className="h-4 w-4" />
                                    {formatEventDate(event.start_date, event.end_date, event.is_all_day)}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {formatEventTime(event.start_date, event.end_date, event.is_all_day)}
                                  </span>
                                  {event.location && (
                                    <span className="flex items-center gap-1.5">
                                      <MapPin className="h-4 w-4" />
                                      {event.location}
                                    </span>
                                  )}
                                </div>
                                {event.website_url && (
                                  <a
                                    href={event.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
                                  >
                                    Weitere Infos
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
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
