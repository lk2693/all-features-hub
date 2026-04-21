import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { UserPlus, ArrowRight, Check, Calendar, Users, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getIcon } from "@/lib/iconMap";
import mitmachenHero from "@/assets/mitmachen-hero.jpg";

interface BenefitRow { id: string; title: string; description: string | null; icon: string | null; }
interface MemberTypeRow {
  id: string; title: string; price: string; description: string | null;
  features: string[]; highlighted: boolean; cta_text: string; cta_link: string;
}
interface StepRow { id: string; title: string; description: string | null; }
interface AgRow {
  id: string; name: string; description: string | null; icon: string | null;
  image_url: string | null; member_count: number | null; meeting_info: string | null;
}
interface CMSRow {
  block_key: string; title: string | null; subtitle: string | null;
  content: string | null; image_url: string | null;
  cta_text: string | null; cta_link: string | null;
  metadata: Record<string, unknown> | null;
}

export interface MitmachenPreviewData {
  hero?: {
    badge: string; title: string; subtitle: string; image_url: string;
    cta_text: string; cta_link: string; secondary_cta_text: string; secondary_cta_link: string;
  };
  benefits_intro?: { title: string; subtitle: string };
  benefits?: BenefitRow[];
  member_types?: MemberTypeRow[];
  steps_intro?: { title: string; subtitle: string };
  steps?: StepRow[];
  ags_intro?: { title: string; subtitle: string };
  cta?: {
    title: string; content: string;
    cta_text: string; cta_link: string;
    secondary_cta_text: string; secondary_cta_link: string;
  };
}

export default function Mitmachen({ previewData }: { previewData?: MitmachenPreviewData } = {}) {
  const [cmsMap, setCmsMap] = useState<Map<string, CMSRow>>(new Map());
  const [benefits, setBenefits] = useState<BenefitRow[]>([]);
  const [memberTypes, setMemberTypes] = useState<MemberTypeRow[]>([]);
  const [steps, setSteps] = useState<StepRow[]>([]);
  const [ags, setAgs] = useState<AgRow[]>([]);

  useEffect(() => {
    if (previewData) return;
    async function load() {
      try {
        const [cms, b, mt, st, ag] = await Promise.all([
          supabase.from("cms_content").select("block_key, title, subtitle, content, image_url, cta_text, cta_link, metadata")
            .in("block_key", ["mitmachen_hero", "mitmachen_benefits_intro", "mitmachen_steps_intro", "mitmachen_ags_intro", "mitmachen_cta"]),
          supabase.from("mitmachen_benefits").select("id, title, description, icon, sort_order").eq("is_active", true).order("sort_order"),
          supabase.from("mitmachen_member_types").select("id, title, price, description, features, highlighted, cta_text, cta_link, sort_order").eq("is_active", true).order("sort_order"),
          supabase.from("mitmachen_steps").select("id, title, description, sort_order").eq("is_active", true).order("sort_order"),
          supabase.from("working_groups").select("id, name, description, icon, image_url, member_count, meeting_info, sort_order").eq("is_active", true).order("sort_order"),
        ]);
        const map = new Map<string, CMSRow>();
        (cms.data ?? []).forEach((r) => map.set(r.block_key, r as CMSRow));
        setCmsMap(map);
        setBenefits((b.data ?? []) as BenefitRow[]);
        setMemberTypes((mt.data ?? []).map((r) => ({
          ...r,
          features: Array.isArray(r.features) ? (r.features as string[]) : [],
        })) as MemberTypeRow[]);
        setSteps((st.data ?? []) as StepRow[]);
        setAgs((ag.data ?? []) as AgRow[]);
      } catch (e) {
        console.error("Error loading mitmachen page:", e);
      }
    }
    load();
  }, [previewData]);

  // Resolve content with preview overrides.
  const heroRow = cmsMap.get("mitmachen_hero");
  const heroMeta = (heroRow?.metadata as Record<string, unknown> | null) ?? {};
  const hero = previewData?.hero ?? {
    badge: typeof heroMeta.badge === "string" ? heroMeta.badge : "Mitmachen",
    title: heroRow?.title ?? "Werde Teil der Kulturszene",
    subtitle: heroRow?.subtitle ?? "",
    image_url: heroRow?.image_url ?? "",
    cta_text: heroRow?.cta_text ?? "Jetzt Mitglied werden",
    cta_link: heroRow?.cta_link ?? "/kontakt",
    secondary_cta_text: typeof heroMeta.secondary_cta_text === "string" ? heroMeta.secondary_cta_text : "Arbeitsgruppen entdecken",
    secondary_cta_link: typeof heroMeta.secondary_cta_link === "string" ? heroMeta.secondary_cta_link : "#ags",
  };
  const heroBg = hero.image_url || mitmachenHero;

  const benefitsIntroRow = cmsMap.get("mitmachen_benefits_intro");
  const benefitsIntro = previewData?.benefits_intro ?? {
    title: benefitsIntroRow?.title ?? "Deine Vorteile als Mitglied",
    subtitle: benefitsIntroRow?.subtitle ?? "",
  };

  const stepsIntroRow = cmsMap.get("mitmachen_steps_intro");
  const stepsIntro = previewData?.steps_intro ?? {
    title: stepsIntroRow?.title ?? "So wirst du Mitglied",
    subtitle: stepsIntroRow?.subtitle ?? "",
  };

  const agsIntroRow = cmsMap.get("mitmachen_ags_intro");
  const agsIntro = previewData?.ags_intro ?? {
    title: agsIntroRow?.title ?? "Arbeitsgruppen",
    subtitle: agsIntroRow?.subtitle ?? "",
  };

  const ctaRow = cmsMap.get("mitmachen_cta");
  const ctaMeta = (ctaRow?.metadata as Record<string, unknown> | null) ?? {};
  const cta = previewData?.cta ?? {
    title: ctaRow?.title ?? "Fragen? Wir helfen gerne!",
    content: ctaRow?.content ?? "",
    cta_text: ctaRow?.cta_text ?? "Kontakt aufnehmen",
    cta_link: ctaRow?.cta_link ?? "/kontakt",
    secondary_cta_text: typeof ctaMeta.secondary_cta_text === "string" ? ctaMeta.secondary_cta_text : "",
    secondary_cta_link: typeof ctaMeta.secondary_cta_link === "string" ? ctaMeta.secondary_cta_link : "",
  };

  const benefitItems = previewData?.benefits ?? benefits;
  const memberTypeItems = previewData?.member_types ?? memberTypes;
  const stepItems = previewData?.steps ?? steps;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <img src={heroBg} alt="Mitmachen" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />

        <div className="container relative z-10 pb-14 pt-36">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/90 text-primary-foreground mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {hero.badge}
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {hero.title}
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-background/60 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            {hero.cta_text && (
              <Link
                to={hero.cta_link || "/kontakt"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <UserPlus className="h-4 w-4" />
                {hero.cta_text}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {hero.secondary_cta_text && (
              <a
                href={hero.secondary_cta_link || "#ags"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-background/30 text-background hover:bg-background/10 transition-colors"
              >
                {hero.secondary_cta_text}
              </a>
            )}
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
              {benefitsIntro.title}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              {benefitsIntro.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {benefitItems.map((benefit, index) => {
              const Icon = getIcon(benefit.icon ?? "Sparkles");
              return (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Membership Types */}
          <div className="grid md:grid-cols-2 gap-6">
            {memberTypeItems.map((type, index) => (
              <motion.div
                key={type.id}
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
                <p className="text-sm text-muted-foreground mb-6">{type.description}</p>
                <ul className="space-y-2.5 mb-8">
                  {type.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={type.cta_link || "/kontakt"}
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all",
                    type.highlighted
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border text-foreground hover:bg-muted"
                  )}
                >
                  {type.cta_text || "Jetzt beitreten"}
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
              {stepsIntro.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{stepsIntro.subtitle}</p>
          </motion.div>

          <div className="space-y-0">
            {stepItems.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-6 relative"
              >
                {/* Line */}
                {index < stepItems.length - 1 && (
                  <div className="absolute left-[19px] top-12 bottom-0 w-px bg-border" />
                )}
                {/* Number */}
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-lg shrink-0 z-10">
                  {index + 1}
                </div>
                {/* Content */}
                <div className="pb-10">
                  <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
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
