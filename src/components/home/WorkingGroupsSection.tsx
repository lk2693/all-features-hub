import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCMSContent } from "@/hooks/useCMSContent";
import { getIcon } from "@/lib/iconMap";

import agKulturpolitik from "@/assets/ag-kulturpolitik.jpg";
import agFoerderung from "@/assets/ag-foerderung.jpg";
import agOeffentlichkeit from "@/assets/ag-oeffentlichkeit.jpg";
import agRessourcen from "@/assets/ag-ressourcen.jpg";

const fallbackImages = [agKulturpolitik, agFoerderung, agOeffentlichkeit, agRessourcen];

export interface WorkingGroupItem {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  image_url?: string | null;
  member_count?: number | null;
}

interface PreviewData {
  intro?: { title?: string | null; subtitle?: string | null; cta_text?: string | null; cta_link?: string | null };
  items?: WorkingGroupItem[];
}

const fallbackGroups: WorkingGroupItem[] = [
  { id: "1", name: "AG Kulturpolitik",         description: "Stellungnahmen & politische Vertretung", icon: "Target",    member_count: 12 },
  { id: "2", name: "AG Förderung",             description: "Förderinfos & Antrags-Workshops",        icon: "FileCheck", member_count: 8 },
  { id: "3", name: "AG Öffentlichkeitsarbeit", description: "Website, Social Media & PR",             icon: "Megaphone", member_count: 6 },
  { id: "4", name: "AG Ressourcen",            description: "Ressourcenpool & neue Angebote",         icon: "Palette",   member_count: 5 },
];

export default function WorkingGroupsSection({ previewData }: { previewData?: PreviewData } = {}) {
  const { content: intro } = useCMSContent("working_groups_intro");
  const [groups, setGroups] = useState<WorkingGroupItem[]>(fallbackGroups);

  useEffect(() => {
    if (previewData?.items) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("working_groups")
        .select("id, name, description, icon, image_url, member_count, sort_order")
        .eq("is_active", true)
        .order("sort_order");
      if (!cancelled && data && data.length > 0) {
        setGroups(data as WorkingGroupItem[]);
      }
    })();
    return () => { cancelled = true; };
  }, [previewData?.items]);

  const items = previewData?.items ?? groups;
  const introTitleRaw = previewData?.intro?.title ?? intro.title ?? "Arbeitsgruppen";
  const introSubtitle = previewData?.intro?.subtitle ?? intro.subtitle ?? "In unseren AGs gestaltest du aktiv mit – von Kulturpolitik bis Öffentlichkeitsarbeit.";
  const meta = (intro.metadata ?? {}) as Record<string, string>;
  const ctaText = previewData?.intro?.cta_text ?? meta.cta_text ?? "Alle AGs";
  const ctaLink = previewData?.intro?.cta_link ?? meta.cta_link ?? "/mitmachen";

  // Split title for gradient on last "syllable" group
  const headPart = introTitleRaw.length > 7 ? introTitleRaw.slice(0, -7) : introTitleRaw;
  const tailPart = introTitleRaw.length > 7 ? introTitleRaw.slice(-7) : "";

  return (
    <section className="py-24 lg:py-36 bg-muted/20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
        >
          <div>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05]">
              {headPart}
              {tailPart && <span className="text-gradient">{tailPart}</span>}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              {introSubtitle}
            </p>
          </div>
          <Link
            to={ctaLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
          >
            {ctaText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((ag, index) => {
            const Icon = getIcon(ag.icon);
            const image = ag.image_url || fallbackImages[index % fallbackImages.length];
            return (
            <motion.div
              key={ag.id ?? ag.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                to="/mitmachen"
                className="group block h-full rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image}
                    alt={ag.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    {typeof ag.member_count === "number" && ag.member_count > 0 && (
                      <span className="text-xs text-muted-foreground">
                        <span className="font-display font-bold text-primary text-sm">{ag.member_count}</span> Mitglieder
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {ag.name}
                  </h3>
                  {ag.description && <p className="text-sm text-muted-foreground">{ag.description}</p>}
                </div>
              </Link>
            </motion.div>
          );})}
        </div>
      </div>
    </section>
  );
}
