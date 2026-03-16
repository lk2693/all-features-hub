import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Newspaper,
  CalendarDays,
  Package,
  Coins,
  Users,
  MessageSquare,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import featureNews from "@/assets/feature-news.jpg";
import featureKalender from "@/assets/feature-kalender.jpg";
import featureRessourcen from "@/assets/feature-ressourcen.jpg";
import featureFoerderung from "@/assets/feature-foerderung.jpg";
import featureCommunity from "@/assets/feature-community.jpg";
import featureKontakt from "@/assets/feature-kontakt.jpg";

const features = [
  {
    title: "News & Blog",
    description: "Aktuelles zu Kulturpolitik, Projekten und der lokalen Kulturszene.",
    icon: Newspaper,
    href: "/news",
    image: featureNews,
    tag: "Aktuelles",
  },
  {
    title: "Kalender",
    description: "Sitzungen, Kulturevents und Förderfristen auf einen Blick.",
    icon: CalendarDays,
    href: "/kalender",
    image: featureKalender,
    tag: "Events",
  },
  {
    title: "Ressourcenpool",
    description: "Technik, Räume, Know-how – finde und teile Ressourcen.",
    icon: Package,
    href: "/ressourcen",
    image: featureRessourcen,
    tag: "Sharing",
  },
  {
    title: "Förderinfos",
    description: "Förderprogramme, Stipendien und Ausschreibungen.",
    icon: Coins,
    href: "/foerderung",
    image: featureFoerderung,
    tag: "Funding",
  },
  {
    title: "Community",
    description: "Vernetze dich mit Künstler:innen und Initiativen.",
    icon: Users,
    href: "/mitmachen",
    image: featureCommunity,
    tag: "Netzwerk",
  },
  {
    title: "Kontakt",
    description: "Direkter Draht zum Kulturrat.",
    icon: MessageSquare,
    href: "/kontakt",
    image: featureKontakt,
    tag: "Kontakt",
  },
];

export default function FeaturesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("a")?.offsetWidth ?? 340;
    el.scrollBy({ left: direction === "left" ? -cardWidth - 16 : cardWidth + 16, behavior: "smooth" });
  };

  return (
    <section className="py-24 lg:py-36 bg-background overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Was wir{" "}
              <span className="text-gradient">bieten</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Deine Anlaufstelle für alles rund um Kultur in Braunschweig.
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-3 rounded-full border border-border bg-card text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Zurück scrollen"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-3 rounded-full border border-border bg-card text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Weiter scrollen"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scrollable cards – full bleed */}
      <div className="relative">
        {/* Fade edges */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide px-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.1, 0, 1] }}
      className="snap-start"
    >
      <Link
        to={feature.href}
        className="group block w-[300px] sm:w-[340px] flex-shrink-0"
      >
        <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-primary/40 transition-all duration-500 hover:shadow-glow">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

            {/* Tag */}
            <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-primary/90 text-primary-foreground backdrop-blur-sm">
              {feature.tag}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 pt-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">
                {feature.title}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {feature.description}
            </p>
            <div className="flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Mehr erfahren
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
