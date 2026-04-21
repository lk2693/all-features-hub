import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { getIcon } from "@/lib/iconMap";
import { useCMSContent } from "@/hooks/useCMSContent";

export interface StatItem {
  id: string;
  label: string;
  value: number | string;
  suffix?: string | null;
  icon?: string | null;
}

interface PreviewData {
  intro?: { title?: string | null; subtitle?: string | null };
  items?: StatItem[];
}

const fallbackStats: StatItem[] = [
  { id: "1", label: "Mitglieder", value: 120, suffix: "+", icon: "Users" },
  { id: "2", label: "Events / Jahr", value: 50, suffix: "+", icon: "Calendar" },
  { id: "3", label: "Ressourcen", value: 80, suffix: "+", icon: "Folder" },
];

export default function StatsCounter({ previewData }: { previewData?: PreviewData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  const { content: intro } = useCMSContent("stats_intro");
  const [stats, setStats] = useState<StatItem[]>(fallbackStats);

  useEffect(() => {
    if (previewData?.items) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("home_stats")
        .select("id, label, value, suffix, icon, sort_order")
        .eq("is_active", true)
        .order("sort_order");
      if (!cancelled && data && data.length > 0) {
        setStats(data.map((d) => ({
          id: d.id, label: d.label, value: Number(d.value), suffix: d.suffix, icon: d.icon,
        })));
      }
    })();
    return () => { cancelled = true; };
  }, [previewData?.items]);

  const items = previewData?.items ?? stats;
  const introTitle = previewData?.intro?.title ?? intro.title;
  const introSubtitle = previewData?.intro?.subtitle ?? intro.subtitle;

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Parallax background pattern */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-tertiary"
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }} />
      </motion.div>

      <div className="container relative z-10">
        {(introTitle || introSubtitle) && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            {introTitle && (
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-tertiary-foreground tracking-tight">
                {introTitle}
              </h2>
            )}
            {introSubtitle && (
              <p className="mt-3 text-tertiary-foreground/60">{introSubtitle}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          {items.map((stat, index) => {
            const Icon = getIcon(stat.icon);
            return (
              <motion.div
                key={stat.id ?? stat.label}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.1, 0, 1] }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="h-8 w-8 text-primary mx-auto mb-4 opacity-80" />
                  <div className="font-display text-6xl lg:text-7xl font-bold text-tertiary-foreground tracking-tight">
                    {stat.value}{stat.suffix ?? ""}
                  </div>
                  <p className="mt-2 text-lg text-tertiary-foreground/60 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
