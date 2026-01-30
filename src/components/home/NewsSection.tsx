import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const news = [
  {
    id: 1,
    title: "Neue Förderrichtlinien für Kulturprojekte 2025",
    excerpt: "Die Stadt Braunschweig hat die neuen Förderrichtlinien veröffentlicht. Hier die wichtigsten Änderungen im Überblick.",
    date: "28. Jan 2025",
    category: "Förderung",
    slug: "neue-foerderrichtlinien-2025",
  },
  {
    id: 2,
    title: "Kulturrat trifft sich zur Vollversammlung",
    excerpt: "Am 15. Februar findet die nächste Vollversammlung statt. Thema: Kulturentwicklungsplan 2030.",
    date: "25. Jan 2025",
    category: "Termine",
    slug: "vollversammlung-februar-2025",
  },
  {
    id: 3,
    title: "Erfolgreiche Kooperation mit dem Staatstheater",
    excerpt: "Das gemeinsame Projekt zur Nachwuchsförderung zeigt erste Erfolge. 15 junge Künstler:innen präsentieren ihre Arbeiten.",
    date: "20. Jan 2025",
    category: "Projekte",
    slug: "kooperation-staatstheater",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function NewsSection() {
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
              Aktuelles
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Neuigkeiten aus der Braunschweiger Kulturszene
            </p>
          </div>
          <Button variant="outline" asChild className="shrink-0">
            <Link to="/news">
              Alle News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {news.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Link to={`/news/${item.slug}`} className="block h-full group">
                <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <Badge variant="secondary" className="font-medium">
                        {item.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {item.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Weiterlesen
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
