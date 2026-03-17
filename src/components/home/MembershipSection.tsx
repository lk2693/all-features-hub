import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { Check, ArrowRight, Users, Vote, Package, BookOpen, Handshake, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import membershipImage from "@/assets/membership-hero.jpg";

const benefits = [
  { icon: Vote, title: "Stimmrecht", desc: "In Vollversammlungen & Abstimmungen" },
  { icon: Package, title: "Ressourcenpool", desc: "Technik, Räume & Know-how nutzen" },
  { icon: BookOpen, title: "Förderberatung", desc: "Infos & Workshops zu Anträgen" },
  { icon: Handshake, title: "Netzwerk", desc: "Kontakte in der Kulturszene knüpfen" },
  { icon: MessageSquare, title: "Newsletter", desc: "Exklusive Infos & Updates" },
  { icon: Users, title: "Arbeitsgruppen", desc: "In AGs aktiv mitgestalten" },
];

const memberTypes = [
  {
    title: "Einzelmitglied",
    price: "Kostenlos",
    desc: "Für freischaffende Künstler:innen und Kulturschaffende",
    features: ["Stimmrecht", "Newsletter", "Ressourcenpool", "Netzwerk-Events"],
    highlighted: false,
  },
  {
    title: "Institution",
    price: "Auf Anfrage",
    desc: "Für Kulturvereine, Theater, Galerien und Kollektive",
    features: ["Alle Einzelvorteile", "Erweiterter Ressourcenzugang", "AG-Mitarbeit", "Logo auf Website"],
    highlighted: true,
  },
];

export default function MembershipSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section ref={ref} className="py-24 lg:py-36 bg-background overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05]">
            Mitglied{" "}
            <span className="text-gradient">werden</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Werde Teil des Kulturrats und gestalte die Kulturpolitik in Braunschweig aktiv mit.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Membership Types */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {memberTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "rounded-2xl border p-7 sm:p-8 transition-all duration-300",
                type.highlighted
                  ? "border-primary/30 bg-primary/5 ring-1 ring-primary/10"
                  : "border-border/50 bg-card"
              )}
            >
              {type.highlighted && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground mb-4">
                  Empfohlen
                </span>
              )}
              <h3 className="font-display text-2xl font-bold text-foreground">{type.title}</h3>
              <div className="mt-2 mb-4">
                <span className="font-display text-3xl font-bold text-primary">{type.price}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{type.desc}</p>
              <ul className="space-y-2.5 mb-8">
                {type.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/mitmachen"
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all",
                  type.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border text-foreground hover:bg-muted"
                )}
              >
                Jetzt beitreten
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Image + Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <motion.img
            src={membershipImage}
            alt="Kulturschaffende arbeiten zusammen"
            className="w-full h-[400px] lg:h-[500px] object-cover"
            style={{ scale: imgScale }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
            <blockquote className="max-w-2xl">
              <p className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-background leading-snug italic">
                „Gemeinsam sind wir die Stimme der Kultur in Braunschweig."
              </p>
              <footer className="mt-4 text-sm text-background/60">
                — Kulturrat Braunschweig e.V.
              </footer>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
