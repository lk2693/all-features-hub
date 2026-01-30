import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Monitor, Home, Lightbulb, Music, Camera, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const resourceCategories = [
  {
    title: "Technik",
    description: "Beamer, Licht, Sound und mehr",
    icon: Monitor,
    count: 24,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Räume",
    description: "Probe-, Aufführungs- und Atelierräume",
    icon: Home,
    count: 18,
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    title: "Know-how",
    description: "Beratung, Workshops, Expertise",
    icon: Lightbulb,
    count: 32,
    color: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Instrumente",
    description: "Musikinstrumente zum Ausleihen",
    icon: Music,
    count: 15,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Medien",
    description: "Foto- und Videoequipment",
    icon: Camera,
    count: 12,
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    title: "Werkzeuge",
    description: "Handwerk und Aufbau",
    icon: Wrench,
    count: 8,
    color: "bg-secondary text-secondary-foreground",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function ResourcesPreview() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Ressourcenpool
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Finde und teile Ressourcen mit anderen Kulturschaffenden – von Technik über Räume bis zu Know-how.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {resourceCategories.map((category) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Link to={`/ressourcen?kategorie=${category.title.toLowerCase()}`} className="block group">
                <Card className="h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", category.color)}>
                        <category.icon className="h-5 w-5" />
                      </div>
                      <span className="text-2xl font-display font-bold text-primary">
                        {category.count}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="font-display text-lg mb-1 group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild className="bg-gradient-hero hover:opacity-90">
            <Link to="/ressourcen">
              Alle Ressourcen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/ressourcen/eintragen">Ressource eintragen</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
