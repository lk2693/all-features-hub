import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Accessibility, Eye, Ear, Hand, MessageSquare, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const accessibilityFeatures = [
  {
    icon: Eye,
    title: "Sehbehinderung",
    description: "Screenreader-optimierte Struktur, ausreichende Kontraste, skalierbare Schriften.",
  },
  {
    icon: Hand,
    title: "Motorische Einschränkungen",
    description: "Vollständige Tastaturnavigation, große Klickflächen, keine zeitkritischen Aktionen.",
  },
  {
    icon: Ear,
    title: "Hörbehinderung",
    description: "Keine rein auditiven Inhalte, visuelle Feedback-Mechanismen.",
  },
  {
    icon: MessageSquare,
    title: "Kognitive Einschränkungen",
    description: "Klare Sprache, konsistente Navigation, Leichte-Sprache-Bereich.",
  },
];

export default function Barrierefreiheit() {
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Accessibility className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Barrierefreiheit
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Wir möchten, dass alle Menschen unsere Website nutzen können. Hier erfahren Sie mehr über unsere Barrierefreiheits-Maßnahmen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Erklärung zur Barrierefreiheit */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Erklärung zur Barrierefreiheit
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Der Kulturrat Braunschweig e.V. ist bemüht, seine Website im Einklang mit den nationalen Rechtsvorschriften zur Umsetzung der EU-Richtlinie 2016/2102 barrierefrei zugänglich zu machen.
              </p>
              <p className="mt-4">
                Diese Erklärung zur Barrierefreiheit gilt für die Website <strong>kulturrat-braunschweig.de</strong>.
              </p>
              <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                Stand der Vereinbarkeit
              </h3>
              <p>
                Diese Website ist mit den Anforderungen der BITV 2.0 (Barrierefreie-Informationstechnik-Verordnung) <strong>teilweise vereinbar</strong>. Wir arbeiten kontinuierlich daran, die Barrierefreiheit zu verbessern.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Unsere Maßnahmen
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Folgende Maßnahmen haben wir ergriffen, um die Barrierefreiheit zu verbessern:
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {accessibilityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leichte Sprache */}
      <section className="py-16 lg:py-24 bg-background" id="leichte-sprache">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl" role="img" aria-label="Leichte Sprache">📖</span>
                  <CardTitle className="font-display text-2xl">
                    Leichte Sprache
                  </CardTitle>
                </div>
                <CardDescription className="text-base">
                  Hier erklären wir unsere Website in einfachen Worten.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator />
                
                <div className="space-y-4 text-lg leading-relaxed">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Was ist der Kultur·rat?
                  </h3>
                  <p className="text-foreground">
                    Der Kultur·rat Braunschweig ist ein Verein.
                  </p>
                  <p className="text-foreground">
                    In dem Verein sind viele Menschen.
                  </p>
                  <p className="text-foreground">
                    Diese Menschen machen Kunst und Kultur.
                  </p>
                  <p className="text-foreground">
                    Zum Beispiel: Musik, Theater, Tanz oder Bilder.
                  </p>

                  <Separator className="my-6" />

                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Was macht der Kultur·rat?
                  </h3>
                  <ul className="space-y-3 text-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>Wir helfen Künstlern und Künstlerinnen.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>Wir bringen Menschen zusammen.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>Wir sagen der Stadt, was Künstler brauchen.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>Wir teilen Räume und Technik.</span>
                    </li>
                  </ul>

                  <Separator className="my-6" />

                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Was finden Sie auf dieser Internet·seite?
                  </h3>
                  <ul className="space-y-3 text-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Über uns:</strong> Wer wir sind.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>News:</strong> Neue Nachrichten.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Kalender:</strong> Wann ist was?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Ressourcen:</strong> Was können Sie leihen?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Förderung:</strong> Wer gibt Geld für Kunst?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Mitmachen:</strong> Wie können Sie mitmachen?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>Kontakt:</strong> Schreiben Sie uns.</span>
                    </li>
                  </ul>

                  <Separator className="my-6" />

                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Brauchen Sie Hilfe?
                  </h3>
                  <p className="text-foreground">
                    Schreiben Sie uns eine E-Mail:
                  </p>
                  <a 
                    href="mailto:info@kulturrat-braunschweig.de" 
                    className="text-primary hover:underline font-medium text-xl inline-block"
                  >
                    info@kulturrat-braunschweig.de
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Feedback */}
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
              Barrieren melden
            </h2>
            <p className="text-tertiary-foreground/80 mb-6">
              Haben Sie Probleme bei der Nutzung unserer Website? Teilen Sie uns Barrieren mit, damit wir diese beheben können.
            </p>
            <div className="space-y-4">
              <Button className="bg-gradient-hero hover:opacity-90" asChild>
                <a href="mailto:barrierefreiheit@kulturrat-braunschweig.de">
                  <Mail className="mr-2 h-4 w-4" />
                  Barriere melden
                </a>
              </Button>
              <p className="text-sm text-tertiary-foreground/60">
                E-Mail: barrierefreiheit@kulturrat-braunschweig.de
              </p>
            </div>

            <Separator className="my-10 bg-tertiary-foreground/20" />

            <div className="text-left">
              <h3 className="font-display text-lg font-semibold mb-3">
                Schlichtungsverfahren
              </h3>
              <p className="text-tertiary-foreground/80 text-sm mb-4">
                Sollten Sie mit unserer Antwort nicht zufrieden sein, können Sie sich an die Schlichtungsstelle nach § 16 BGG wenden:
              </p>
              <Button variant="outline" size="sm" className="border-tertiary-foreground/30" asChild>
                <a 
                  href="https://www.schlichtungsstelle-bgg.de" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Schlichtungsstelle BGG
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
