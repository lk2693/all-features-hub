import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCMSContent } from "@/hooks/useCMSContent";
import { getIcon } from "@/lib/iconMap";

import featureNews from "@/assets/feature-news.jpg";
import featureKalender from "@/assets/feature-kalender.jpg";
import featureRessourcen from "@/assets/feature-ressourcen.jpg";
import featureFoerderung from "@/assets/feature-foerderung.jpg";
import featureCommunity from "@/assets/feature-community.jpg";
import featureKontakt from "@/assets/feature-kontakt.jpg";

const fallbackImages = [featureNews, featureKalender, featureRessourcen, featureFoerderung, featureCommunity, featureKontakt];

export interface FeatureItem {
  id: string;
  title: string;
  subtitle?: string | null;
  icon?: string | null;
  image_url?: string | null;
  link: string;
}

interface PreviewData {
  intro?: { title?: string | null; subtitle?: string | null; cta_text?: string | null; cta_link?: string | null };
  items?: FeatureItem[];
}

const fallbackFeatures: FeatureItem[] = [
  { id: "1", title: "News & Blog",    subtitle: "Aktuelles aus der Kulturszene", icon: "Newspaper",     link: "/news" },
  { id: "2", title: "Kalender",       subtitle: "Events & Termine",              icon: "CalendarDays",  link: "/kalender" },
  { id: "3", title: "Ressourcenpool", subtitle: "Teilen & Finden",               icon: "Package",       link: "/ressourcen" },
  { id: "4", title: "Förderinfos",    subtitle: "Stipendien & Programme",        icon: "Coins",         link: "/foerderung" },
  { id: "5", title: "Community",      subtitle: "Vernetzen & Austauschen",       icon: "Users",         link: "/mitmachen" },
  { id: "6", title: "Kontakt",        subtitle: "Direkter Draht",                icon: "MessageSquare", link: "/kontakt" },
];

export default function FeaturesSection({ previewData }: { previewData?: PreviewData } = {}) {
  const { content: intro } = useCMSContent("features_intro");
  const [features, setFeatures] = useState<FeatureItem[]>(fallbackFeatures);

  useEffect(() => {
    if (previewData?.items) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("home_features")
        .select("id, title, subtitle, icon, image_url, link, sort_order")
        .eq("is_active", true)
        .order("sort_order");
      if (!cancelled && data && data.length > 0) {
        setFeatures(data as FeatureItem[]);
      }
    })();
    return () => { cancelled = true; };
  }, [previewData?.items]);

  const items = previewData?.items ?? features;
  const introTitle = previewData?.intro?.title ?? intro.title ?? "Was wir bieten";
  const introSubtitle = previewData?.intro?.subtitle ?? intro.subtitle;
  const meta = (intro.metadata ?? {}) as Record<string, string>;
  const ctaText = previewData?.intro?.cta_text ?? meta.cta_text ?? "Alle Angebote";
  const ctaLink = previewData?.intro?.cta_link ?? meta.cta_link ?? "/mitmachen";

  // Split last word for gradient
  const words = introTitle.split(" ");
  const last = words.pop() ?? "";
  const head = words.join(" ");

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
          <div>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05]">
              {head}{head && " "}
              <span className="text-gradient">{last}</span>
            </h2>
            {introSubtitle && (
              <p className="mt-4 text-lg text-muted-foreground max-w-xl">{introSubtitle}</p>
            )}
          </div>

          <Link
            to={ctaLink}
            className="inline-flex items-center gap-3 self-start sm:self-auto"
          >
            <span className="px-6 py-3 rounded-full bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors">
              {ctaText}
            </span>
            <span className="p-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((feature, index) => (
            <FeatureCard
              key={feature.id ?? feature.title}
              feature={feature}
              index={index}
              fallbackImage={fallbackImages[index % fallbackImages.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index, fallbackImage }: { feature: FeatureItem; index: number; fallbackImage: string }) {
  const image = feature.image_url || fallbackImage;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.1, 0, 1] }}
    >
      <Link
        to={feature.link}
        className="group relative block aspect-[3/4] rounded-3xl overflow-hidden"
      >
        <img
          src={image}
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
          {feature.subtitle && (
            <p className="text-background/70 text-sm">{feature.subtitle}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
