import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

const features = [
  {
    title: "News & Blog",
    description: "Aktuelles zu Kulturpolitik, Projekten und der lokalen Kulturszene.",
    icon: Newspaper,
    href: "/news",
  },
  {
    title: "Kalender",
    description: "Sitzungen, Kulturevents und Förderfristen auf einen Blick.",
    icon: CalendarDays,
    href: "/kalender",
  },
  {
    title: "Ressourcenpool",
    description: "Technik, Räume, Know-how – finde und teile Ressourcen.",
    icon: Package,
    href: "/ressourcen",
  },
  {
    title: "Förderinfos",
    description: "Förderprogramme, Stipendien und Ausschreibungen.",
    icon: Coins,
    href: "/foerderung",
  },
  {
    title: "Community",
    description: "Vernetze dich mit Künstler:innen und Initiativen.",
    icon: Users,
    href: "/mitmachen",
  },
  {
    title: "Kontakt",
    description: "Direkter Draht zum Kulturrat.",
    icon: MessageSquare,
    href: "/kontakt",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-36 bg-background overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          className="mb-20"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Was wir{" "}
            <span className="text-gradient">bieten</span>
          </h2>
          <p className="mt-6 text-xl text-muted-foreground max-w-xl">
            Deine Anlaufstelle für alles rund um Kultur in Braunschweig.
          </p>
        </motion.div>

        {/* Staggered two-row layout with parallax */}
        <motion.div style={{ x: x1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {features.slice(0, 3).map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>
        <motion.div style={{ x: x2 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.slice(3).map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index + 3} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0, 1] }}
    >
      <Link to={feature.href} className="block group">
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative p-8 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-colors duration-300 overflow-hidden"
        >
          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <feature.icon className="h-7 w-7 text-primary mb-5" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              {feature.title}
              <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-primary" />
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
