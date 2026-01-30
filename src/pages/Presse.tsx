import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Download, Mail, FileText, Image, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const logoAssets = [
  {
    name: "Logo (Farbig)",
    description: "Primäres Logo für helle Hintergründe",
    formats: ["PNG", "SVG"],
    preview: "K",
    bgClass: "bg-gradient-hero",
  },
  {
    name: "Logo (Weiß)",
    description: "Für dunkle Hintergründe",
    formats: ["PNG", "SVG"],
    preview: "K",
    bgClass: "bg-tertiary",
  },
  {
    name: "Logo (Schwarz)",
    description: "Für Druckanwendungen",
    formats: ["PNG", "SVG"],
    preview: "K",
    bgClass: "bg-foreground",
  },
];

const brandColors = [
  { name: "Primär (Terracotta)", hex: "#E85A30", usage: "Hauptfarbe, CTAs" },
  { name: "Akzent (Gold)", hex: "#E6A817", usage: "Highlights, Akzente" },
  { name: "Dunkel (Anthrazit)", hex: "#2D3748", usage: "Text, Footer" },
  { name: "Hintergrund", hex: "#FCFAF8", usage: "Seitenhintergrund" },
];

const pressReleases = [
  {
    title: "Kulturrat Braunschweig startet Ressourcenplattform",
    date: "Januar 2025",
    description: "Neue digitale Plattform vernetzt Kulturschaffende und ermöglicht das Teilen von Ressourcen.",
  },
  {
    title: "Kulturentwicklungsplan 2030 vorgestellt",
    date: "Dezember 2024",
    description: "Gemeinsam mit der Stadt Braunschweig wurde der neue Kulturentwicklungsplan präsentiert.",
  },
];

export default function Presse() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Pressebereich
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Hier finden Sie Logos, Bildmaterial und Pressemitteilungen des Kulturrats Braunschweig für Ihre Berichterstattung.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Logos & Brand Assets */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Image className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Logos & Bildmaterial
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Laden Sie unsere offiziellen Logos in verschiedenen Formaten herunter. Bitte verwenden Sie die Logos unverändert und mit ausreichend Freiraum.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {logoAssets.map((asset, index) => (
              <motion.div
                key={asset.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className={`w-full aspect-video rounded-lg ${asset.bgClass} flex items-center justify-center mb-4`}>
                      <span className="font-display text-4xl font-bold text-primary-foreground">
                        {asset.preview}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <CardDescription>{asset.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {asset.formats.map((format) => (
                        <Button key={format} variant="outline" size="sm" className="gap-2">
                          <Download className="h-3.5 w-3.5" />
                          {format}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Colors */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Markenfarben
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Unsere Corporate-Farben für konsistente Darstellung in allen Medien.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brandColors.map((color, index) => (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div 
                    className="h-24 w-full" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <CardContent className="pt-4">
                    <p className="font-medium text-foreground">{color.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{color.hex}</p>
                    <p className="text-xs text-muted-foreground mt-1">{color.usage}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Pressemitteilungen
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Aktuelle und archivierte Pressemitteilungen des Kulturrats Braunschweig.
            </p>
          </motion.div>

          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-card-hover transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">{release.date}</Badge>
                        <CardTitle className="text-lg">{release.title}</CardTitle>
                        <CardDescription className="mt-2">{release.description}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0 gap-2">
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-16 lg:py-24 bg-tertiary text-tertiary-foreground">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Mail className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="font-display text-2xl font-bold mb-4">
              Pressekontakt
            </h2>
            <p className="text-tertiary-foreground/80 mb-6">
              Für Presseanfragen, Interviews oder weitere Informationen stehen wir Ihnen gerne zur Verfügung.
            </p>
            <div className="space-y-2 mb-8">
              <p className="font-medium">Kulturrat Braunschweig e.V.</p>
              <p className="text-tertiary-foreground/80">Ansprechpartner: Vorstand</p>
              <a 
                href="mailto:presse@kulturrat-braunschweig.de" 
                className="text-primary hover:underline inline-block"
              >
                presse@kulturrat-braunschweig.de
              </a>
            </div>
            <Button className="bg-gradient-hero hover:opacity-90" asChild>
              <a href="mailto:presse@kulturrat-braunschweig.de">
                <Mail className="mr-2 h-4 w-4" />
                Presseanfrage senden
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
