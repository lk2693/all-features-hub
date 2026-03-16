import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Newspaper,
  CalendarDays,
  Package,
  Coins,
  Users,
  MessageSquare,
  ArrowUpRight,
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
    subtitle: "Aktuelles aus der Kulturszene",
    icon: Newspaper,
    href: "/news",
    image: featureNews,
  },
  {
    title: "Kalender",
    subtitle: "Events & Termine",
    icon: CalendarDays,
    href: "/kalender",
    image: featureKalender,
  },
  {
    title: "Ressourcenpool",
    subtitle: "Teilen & Finden",
    icon: Package,
    href: "/ressourcen",
    image: featureRessourcen,
  },
  {
    title: "Förderinfos",
    subtitle: "Stipendien & Programme",
    icon: Coins,
    href: "/foerderung",
    image: featureFoerderung,
  },
  {
    title: "Community",
    subtitle: "Vernetzen & Austauschen",
    icon: Users,
    href: "/mitmachen",
    image: featureCommunity,
  },
  {
    title: "Kontakt",
    subtitle: "Direkter Draht",
    icon: MessageSquare,
    href: "/kontakt",
    image: featureKontakt,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 lg:py-36 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
        >
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05]">
            Was wir{" "}
            <span className="text-gradient">bieten</span>
          </h2>

          <Link
            to="/mitmachen"
            className="inline-flex items-center gap-3 self-start sm:self-auto"
          >
            <span className="px-6 py-3 rounded-full bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors">
              Alle Angebote
            </span>
            <span className="p-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.1, 0, 1] }}
    >
      <Link
        to={feature.href}
        className="group relative block aspect-[3/4] rounded-3xl overflow-hidden"
      >
        <img
          src={feature.image}
          alt={feature.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

        <div className="absolute top-4 right-4 p-2.5 rounded-full bg-background/90 text-foreground backdrop-blur-sm opacity-80 group-hover:opacity-100 group-hover:bg-background transition-all duration-300">
          <ArrowUpRight className="h-4 w-4" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-2xl font-bold text-background mb-1">
            {feature.title}
          </h3>
          <p className="text-background/70 text-sm">
            {feature.subtitle}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
