import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { FileText, Loader2, ArrowRight, Download } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { getIcon } from "@/lib/iconMap";
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

interface AboutValueRow { id: string; title: string; description: string | null; icon: string | null; }
interface AboutDocumentRow { id: string; title: string; description: string | null; file_url: string; icon: string | null; }

export interface UeberUnsPreviewData {
  hero?: { badge: string; title: string; subtitle: string; image_url: string };
  mission?: { badge: string; title: string; content: string; cta_text: string; cta_link: string };
  values?: AboutValueRow[];
  vorstand_intro?: { badge: string; title: string; subtitle: string };
  satzung?: { title: string; content: string };
  documents?: AboutDocumentRow[];
}

interface CMSRow { block_key: string; title: string | null; subtitle: string | null; content: string | null; image_url: string | null; cta_text: string | null; cta_link: string | null; metadata: Record<string, unknown> | null; }

export default function UeberUns({ previewData }: { previewData?: UeberUnsPreviewData } = {}) {
  const [cmsMap, setCmsMap] = useState<Map<string, CMSRow>>(new Map());
  const [values, setValues] = useState<AboutValueRow[]>([]);
  const [documents, setDocuments] = useState<AboutDocumentRow[]>([]);
  const [vorstand, setVorstand] = useState<VorstandMember[]>([]);
  const [isLoadingVorstand, setIsLoadingVorstand] = useState(true);

  useEffect(() => {
    if (previewData) return; // skip fetch in preview mode
    async function load() {
      try {
        const [cms, vals, docs, vors] = await Promise.all([
          supabase.from("cms_content").select("block_key, title, subtitle, content, image_url, cta_text, cta_link, metadata")
            .in("block_key", ["ueberuns_hero", "ueberuns_mission", "ueberuns_vorstand", "ueberuns_satzung"]),
          supabase.from("about_values").select("id, title, description, icon, sort_order").eq("is_active", true).order("sort_order"),
          supabase.from("about_documents").select("id, title, description, file_url, icon, sort_order").eq("is_active", true).order("sort_order"),
          supabase.from("vorstand_members").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
        ]);
        const map = new Map<string, CMSRow>();
        (cms.data ?? []).forEach((r) => map.set(r.block_key, r as CMSRow));
        setCmsMap(map);
        setValues((vals.data ?? []) as AboutValueRow[]);
        setDocuments((docs.data ?? []) as AboutDocumentRow[]);
        setVorstand(((vors.data ?? []) as unknown) as VorstandMember[]);
      } catch (error) {
        console.error("Error loading about page:", error);
      } finally {
        setIsLoadingVorstand(false);
      }
    }
    load();
  }, [previewData]);

  // Resolve content with preview overrides taking priority.
  const heroRow = cmsMap.get("ueberuns_hero");
  const heroMeta = (heroRow?.metadata as Record<string, unknown> | null) ?? {};
  const hero = previewData?.hero ?? {
    badge: typeof heroMeta.badge === "string" ? heroMeta.badge : "Über uns",
    title: heroRow?.title ?? "Wir gestalten Kultur in Braunschweig",
    subtitle: heroRow?.subtitle ?? "",
    image_url: heroRow?.image_url ?? "",
  };
  const heroBg = hero.image_url || ueberUnsHero;

  const missionRow = cmsMap.get("ueberuns_mission");
  const missionMeta = (missionRow?.metadata as Record<string, unknown> | null) ?? {};
  const mission = previewData?.mission ?? {
    badge: typeof missionMeta.badge === "string" ? missionMeta.badge : "Mission",
    title: missionRow?.title ?? "Unsere Mission",
    content: missionRow?.content ?? "",
    cta_text: missionRow?.cta_text ?? "Mitglied werden",
    cta_link: missionRow?.cta_link ?? "/mitmachen",
  };

  const vorstandRow = cmsMap.get("ueberuns_vorstand");
  const vorstandMeta = (vorstandRow?.metadata as Record<string, unknown> | null) ?? {};
  const vorstandIntro = previewData?.vorstand_intro ?? {
    badge: typeof vorstandMeta.badge === "string" ? vorstandMeta.badge : "Team",
    title: vorstandRow?.title ?? "Unser Vorstand",
    subtitle: vorstandRow?.subtitle ?? "",
  };

  const satzungRow = cmsMap.get("ueberuns_satzung");
  const satzung = previewData?.satzung ?? {
    title: satzungRow?.title ?? "Satzung & Geschäftsordnung",
    content: satzungRow?.content ?? "",
  };

  const valueItems = previewData?.values ?? values;
  const documentItems = previewData?.documents ?? documents;

  function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <Layout>
      {/* Hero – full-width image with overlay */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <img
          src={heroBg}
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
            {hero.badge}
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background tracking-tight max-w-3xl leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {hero.title}
          </motion.h1>
          <motion.p
            className="mt-5 text-lg text-background/70 leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {hero.subtitle}
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
                {mission.badge}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {mission.title}
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
                {mission.content}
              </p>
              {mission.cta_text && (
                <Link
                  to={mission.cta_link || "/mitmachen"}
                  className="group inline-flex items-center gap-2 mt-8 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  {mission.cta_text}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </motion.div>

            {/* Leitbild grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {valueItems.map((item, i) => {
                const Icon = getIcon(item.icon ?? "Sparkles");
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300"
                  >
                    <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-foreground mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
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
              {vorstandIntro.badge}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              {vorstandIntro.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              {vorstandIntro.subtitle}
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
