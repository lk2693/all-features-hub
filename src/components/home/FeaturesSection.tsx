import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Newspaper, 
  CalendarDays, 
  Package, 
  Coins, 
  Users, 
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "News & Blog",
    description: "Aktuelles zu Kulturpolitik, Projekten und der lokalen Kulturszene.",
    icon: Newspaper,
    href: "/news",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Veranstaltungskalender",
    description: "Übersicht über Sitzungen, Kulturevents und wichtige Förderfristen.",
    icon: CalendarDays,
    href: "/kalender",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    title: "Ressourcenpool",
    description: "Technik, Räume, Know-how – finde und teile Ressourcen mit anderen.",
    icon: Package,
    href: "/ressourcen",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    title: "Förderinfos",
    description: "Förderprogramme, Stipendien und Ausschreibungen auf einen Blick.",
    icon: Coins,
    href: "/foerderung",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Community",
    description: "Vernetze dich mit Künstler:innen, Kollektiven und Initiativen.",
    icon: Users,
    href: "/mitmachen",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    title: "Kontakt",
    description: "Direkter Draht zum Kulturrat – wir helfen gerne weiter.",
    icon: MessageSquare,
    href: "/kontakt",
    color: "bg-secondary text-secondary-foreground",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Was wir bieten
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Der Kulturrat Braunschweig ist deine Anlaufstelle für alles rund um Kultur in der Region.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Link to={feature.href} className="block h-full group">
                <Card className="h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50">
                  <CardHeader>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", feature.color)}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-display text-xl flex items-center gap-2">
                      {feature.title}
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
