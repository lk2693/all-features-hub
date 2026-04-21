import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Monitor, Home, Lightbulb, Music, Camera, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import ressourcenImage from "@/assets/ressourcen-preview.jpg";
import { useCMSContent } from "@/hooks/useCMSContent";

interface PreviewData {
  intro?: { title?: string | null; subtitle?: string | null };
}

const resourceCategories = [
  { title: "Technik", description: "Beamer, Licht, Sound", icon: Monitor, count: 24, style: "bg-primary/10 text-primary" },
  { title: "Räume", description: "Probe- & Atelierräume", icon: Home, count: 18, style: "bg-accent/30 text-accent-foreground" },
  { title: "Know-how", description: "Beratung & Expertise", icon: Lightbulb, count: 32, style: "bg-secondary text-secondary-foreground" },
  { title: "Instrumente", description: "Zum Ausleihen", icon: Music, count: 15, style: "bg-primary/10 text-primary" },
  { title: "Medien", description: "Foto & Video", icon: Camera, count: 12, style: "bg-accent/30 text-accent-foreground" },
  { title: "Werkzeuge", description: "Handwerk & Aufbau", icon: Wrench, count: 8, style: "bg-secondary text-secondary-foreground" },
];

export default function ResourcesPreview({ previewData }: { previewData?: PreviewData } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const { content: intro } = useCMSContent("resources_intro");
  const introTitleRaw = previewData?.intro?.title ?? intro.title ?? "Ressourcenpool";
  const introSubtitle = previewData?.intro?.subtitle ?? intro.subtitle ?? "Finde und teile Ressourcen mit anderen Kulturschaffenden.";
  const words = introTitleRaw.split(" ");
  const last = words.pop() ?? "";
  const head = words.join(" ");

  return (
    <section ref={ref} className="py-24 lg:py-36 bg-gradient-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14"
        >
          <div>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05]">
              {head}{head && " "}
              <span className="text-gradient">{last}</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {introSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/ressourcen/eintragen"
              className="px-5 py-2.5 rounded-full text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
            >
              Eintragen
            </Link>
            <Link
              to="/ressourcen"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Alle Ressourcen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
            {resourceCategories.map((cat, index) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <Link
                  to={`/ressourcen?kategorie=${cat.title.toLowerCase()}`}
                  className="group flex flex-col p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300 h-full"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", cat.style)}>
                      <cat.icon className="h-4 w-4" />
                    </div>
                    <span className="font-display text-2xl font-bold text-primary/50 group-hover:text-primary transition-colors">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative h-full rounded-3xl overflow-hidden min-h-[500px]">
              <motion.img
                src={ressourcenImage}
                alt="Kreatives Studio mit Equipment"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ scale: imgScale }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

              <div className="absolute top-5 right-5 p-2.5 rounded-full bg-background/90 text-foreground">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="font-display text-2xl font-bold text-background leading-snug">
                  Alles, was du für dein Projekt brauchst
                </p>
                <p className="text-sm text-background/60 mt-2 max-w-sm">
                  Von Soundequipment bis Proberäume – unsere Community teilt Ressourcen.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
