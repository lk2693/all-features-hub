import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Users, UserPlus, Handshake, FileCheck, ArrowRight, Check, MessageSquare, Calendar, Target, Megaphone, Palette, Vote, Package, BookOpen, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import mitmachenHero from "@/assets/mitmachen-hero.jpg";
import agKulturpolitik from "@/assets/ag-kulturpolitik.jpg";
import agFoerderung from "@/assets/ag-foerderung.jpg";
import agOeffentlichkeit from "@/assets/ag-oeffentlichkeit.jpg";
import agRessourcen from "@/assets/ag-ressourcen.jpg";

const membershipBenefits = [
  { icon: Vote, title: "Stimmrecht", desc: "In Vollversammlungen & Abstimmungen" },
  { icon: Package, title: "Ressourcenpool", desc: "Technik, Räume & Know-how nutzen" },
  { icon: BookOpen, title: "Förderberatung", desc: "Infos & Workshops zu Anträgen" },
  { icon: Handshake, title: "Netzwerk", desc: "Kontakte in der Kulturszene knüpfen" },
  { icon: MessageSquare, title: "Newsletter", desc: "Exklusive Infos & Updates" },
  { icon: Users, title: "Arbeitsgruppen", desc: "In AGs aktiv mitgestalten" },
];

const steps = [
  { num: "1", title: "Kontakt aufnehmen", desc: "Schreib uns über das Kontaktformular oder per E-Mail." },
  { num: "2", title: "Antrag ausfüllen", desc: "Wir senden dir den Mitgliedsantrag zu." },
  { num: "3", title: "Willkommen!", desc: "Nach Bestätigung bist du offiziell Mitglied." },
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

const ags = [
  {
    icon: Target,
    name: "AG Kulturpolitik",
    description: "Erarbeitet Stellungnahmen und vertritt die Interessen der Kulturszene gegenüber Politik und Verwaltung.",
    members: 12,
    nextMeeting: "18. März 2025",
    image: agKulturpolitik,
  },
  {
    icon: FileCheck,
    name: "AG Förderung",
    description: "Sammelt Infos zu Fördermöglichkeiten und organisiert Workshops zum Thema Antragsstellung.",
    members: 8,
    nextMeeting: "25. März 2025",
    image: agFoerderung,
  },
  {
    icon: Megaphone,
    name: "AG Öffentlichkeitsarbeit",
    description: "Kümmert sich um Website, Social Media und die Außendarstellung des Kulturrats.",
    members: 6,
    nextMeeting: "10. März 2025",
    image: agOeffentlichkeit,
  },
  {
    icon: Palette,
    name: "AG Ressourcen",
    description: "Pflegt den Ressourcenpool und entwickelt neue Angebote für Kulturschaffende.",
    members: 5,
    nextMeeting: "20. März 2025",
    image: agRessourcen,
  },
];

export default function Mitmachen() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <img src={mitmachenHero} alt="Mitmachen" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />

        <div className="container relative z-10 pb-14 pt-36">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/90 text-primary-foreground mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Mitmachen
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Werde Teil der Kulturszene
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-background/60 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Vernetze dich, bring dich ein und gestalte die Kulturpolitik unserer Stadt mit.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <UserPlus className="h-4 w-4" />
              Jetzt Mitglied werden
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#ags"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-background/30 text-background hover:bg-background/10 transition-colors"
            >
              Arbeitsgruppen entdecken
            </a>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Deine Vorteile als Mitglied
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Die Mitgliedschaft steht allen Kulturschaffenden, Künstler:innen und Kulturinstitutionen offen.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {membershipBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300"
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
          <div className="grid md:grid-cols-2 gap-6">
            {memberTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "rounded-2xl border p-7 sm:p-8",
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
                  to="/kontakt"
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
        </div>
      </section>

      {/* How to join */}
      <section className="py-20 lg:py-28 bg-muted/20">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              So wirst du Mitglied
            </h2>
            <p className="mt-3 text-muted-foreground">In drei einfachen Schritten</p>
          </motion.div>

          <div className="space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-6 relative"
              >
                {/* Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[19px] top-12 bottom-0 w-px bg-border" />
                )}
                {/* Number */}
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-lg shrink-0 z-10">
                  {step.num}
                </div>
                {/* Content */}
                <div className="pb-10">
                  <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Arbeitsgruppen */}
      <section className="py-20 lg:py-28 bg-background" id="ags">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Arbeitsgruppen
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              In unseren AGs kannst du aktiv an der Arbeit des Kulturrats mitwirken.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {ags.map((ag, index) => (
              <motion.div
                key={ag.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="group h-full rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300">
                  {/* Image */}
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={ag.image}
                      alt={ag.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ag.icon className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {ag.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{ag.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        {ag.members} Mitglieder
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {ag.nextMeeting}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-foreground">
        <div className="container text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-background mb-4">
              Fragen? Wir helfen gerne!
            </h2>
            <p className="text-background/60 mb-8">
              Du hast Fragen zur Mitgliedschaft oder möchtest mehr über unsere Arbeit erfahren?
              Kontaktiere uns – wir freuen uns auf dich!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Mail className="h-4 w-4" />
                Kontakt aufnehmen
              </Link>
              <a
                href="mailto:info@kulturrat-braunschweig.de"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-background/20 text-background hover:bg-background/10 transition-colors"
              >
                info@kulturrat-braunschweig.de
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
