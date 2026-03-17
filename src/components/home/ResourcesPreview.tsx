import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Monitor, Home, Lightbulb, Music, Camera, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const resourceCategories = [
  { title: "Technik", description: "Beamer, Licht, Sound und mehr", icon: Monitor, count: 24, style: "bg-primary/10 text-primary" },
  { title: "Räume", description: "Probe-, Aufführungs- und Atelierräume", icon: Home, count: 18, style: "bg-accent/30 text-accent-foreground" },
  { title: "Know-how", description: "Beratung, Workshops, Expertise", icon: Lightbulb, count: 32, style: "bg-secondary text-secondary-foreground" },
  { title: "Instrumente", description: "Musikinstrumente zum Ausleihen", icon: Music, count: 15, style: "bg-primary/10 text-primary" },
  { title: "Medien", description: "Foto- und Videoequipment", icon: Camera, count: 12, style: "bg-accent/30 text-accent-foreground" },
  { title: "Werkzeuge", description: "Handwerk und Aufbau", icon: Wrench, count: 8, style: "bg-secondary text-secondary-foreground" },
];

export default function ResourcesPreview() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Ressourcenpool
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Finde und teile Ressourcen mit anderen Kulturschaffenden.
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceCategories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
            >
              <Link
                to={`/ressourcen?kategorie=${cat.title.toLowerCase()}`}
                className="group flex items-center gap-4 p-5 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", cat.style)}>
                  <cat.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{cat.description}</p>
                </div>
                <span className="font-display text-2xl font-bold text-primary/60 group-hover:text-primary transition-colors shrink-0">
                  {cat.count}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
