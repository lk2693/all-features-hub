import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Target, FileText, Heart, Loader2, ArrowRight, Download, Handshake, Eye, Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCMSContent } from "@/hooks/useCMSContent";
import { supabase } from "@/integrations/supabase/client";
import ueberUnsHero from "@/assets/ueberuns-hero.jpg";

interface VorstandMember {
  id: string;
  name: string;
  role: string;
  bereich: string;
  bio: string | null;
  image_url: string | null;
  email: string | null;
}

const leitbildItems = [
  {
    icon: Heart,
    title: "Kultur ist unverzichtbar",
    text: "Kultur ist ein unverzichtbarer Teil unserer Gesellschaft",
  },
  {
    icon: Users2,
    title: "Vielfalt & Inklusion",
    text: "Vielfalt und Inklusion prägen unser Handeln",
  },
  {
    icon: Eye,
    title: "Transparenz & Partizipation",
    text: "Transparenz und Partizipation sind unsere Grundprinzipien",
  },
  {
    icon: Handshake,
    title: "Kooperation",
    text: "Kooperation geht vor Konkurrenz",
  },
];

export default function UeberUns() {
  const { content: heroContent } = useCMSContent("ueberuns_hero");
  const { content: missionContent } = useCMSContent("ueberuns_mission");
  const [vorstand, setVorstand] = useState<VorstandMember[]>([]);
  const [isLoadingVorstand, setIsLoadingVorstand] = useState(true);

  useEffect(() => {
    async function fetchVorstand() {
      try {
        const { data, error } = await supabase
          .from("vorstand_members")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (error) throw error;
        setVorstand((data || []) as unknown as VorstandMember[]);
      } catch (error) {
        console.error("Error fetching vorstand:", error);
      } finally {
        setIsLoadingVorstand(false);
      }
    }
    fetchVorstand();
  }, []);

  function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <Layout>
      {/* Hero – full-width image with overlay */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <img
          src={ueberUnsHero}
          alt="Kulturrat Braunschweig Team"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />

        <div className="container relative z-10 pb-16 pt-40">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/90 text-primary-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Über uns
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background tracking-tight max-w-3xl leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {heroContent.title}
          </motion.h1>
          <motion.p
            className="mt-5 text-lg text-background/70 leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {heroContent.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 lg:py-32 bg-background" id="leitbild">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Mission text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/10 text-primary mb-5">
                Mission
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {missionContent.title}
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
                {missionContent.content}
              </p>
              <Link
                to="/mitmachen"
                className="group inline-flex items-center gap-2 mt-8 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Mitglied werden
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Leitbild grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {leitbildItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300"
                >
                  <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vorstand */}
      <section className="py-24 lg:py-32 bg-muted/30" id="vorstand">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-14"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/10 text-primary mb-5">
              Team
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Unser Vorstand
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Ehrenamtlich engagiert für die Kulturszene Braunschweigs.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {isLoadingVorstand ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : vorstand.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Keine Vorstandsmitglieder gefunden.
              </div>
            ) : (
              vorstand.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 hover:shadow-glow transition-all duration-300"
                >
                  {/* Avatar area */}
                  <div className="aspect-[4/3] bg-muted/50 flex items-center justify-center overflow-hidden">
                    {person.image_url ? (
                      <img
                        src={person.image_url}
                        alt={person.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Avatar className="w-24 h-24">
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-display font-bold">
                          {getInitials(person.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {person.name}
                    </h3>
                    <p className="text-primary text-sm font-medium mt-0.5">
                      {person.role}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {person.bereich}
                    </p>
                    {person.bio && (
                      <p className="text-muted-foreground text-sm mt-3 line-clamp-2 leading-relaxed">
                        {person.bio}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Satzung */}
      <section className="py-24 lg:py-32 bg-background" id="satzung">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="p-3 rounded-2xl bg-secondary/50 w-fit mx-auto mb-6">
              <FileText className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Satzung & Geschäftsordnung
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Die Satzung und Geschäftsordnung des Kulturrat Braunschweig e.V. regeln
              unsere Arbeitsweise und Entscheidungsprozesse.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                Satzung (PDF)
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Download className="h-4 w-4" />
                Geschäftsordnung (PDF)
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
