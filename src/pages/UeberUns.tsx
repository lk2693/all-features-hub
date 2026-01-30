import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Users, Target, FileText, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCMSContent } from "@/hooks/useCMSContent";
import ExpandingHero from "@/components/ueber-uns/ExpandingHero";

const vorstand = [
  { name: "Dr. Maria Schmidt", role: "1. Vorsitzende", bereich: "Bildende Kunst" },
  { name: "Thomas Müller", role: "2. Vorsitzender", bereich: "Musik" },
  { name: "Julia Weber", role: "Schatzmeisterin", bereich: "Theater" },
  { name: "Michael Braun", role: "Schriftführer", bereich: "Literatur" },
];

export default function UeberUns() {
  const { content: missionContent } = useCMSContent("ueberuns_mission");

  return (
    <Layout>
      {/* Expanding Hero with rotating images */}
      <ExpandingHero />

      {/* Mission & Leitbild */}
      <section className="py-16 lg:py-24 bg-background" id="leitbild">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border-border/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-display text-2xl">{missionContent.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed space-y-4">
                  <p>{missionContent.content}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full border-border/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-display text-2xl">Leitbild</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Kultur ist ein unverzichtbarer Teil unserer Gesellschaft</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Vielfalt und Inklusion prägen unser Handeln</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Transparenz und Partizipation sind unsere Grundprinzipien</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Kooperation geht vor Konkurrenz</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vorstand */}
      <section className="py-16 lg:py-24 bg-gradient-section" id="vorstand">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Unser Vorstand
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Ehrenamtlich engagiert für die Kulturszene Braunschweigs
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vorstand.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center border-border/50">
                  <CardHeader>
                    <div className="w-20 h-20 rounded-full bg-gradient-hero mx-auto flex items-center justify-center mb-4">
                      <Users className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <CardTitle className="font-display text-lg">{person.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="font-medium text-primary">{person.role}</p>
                    <p className="text-sm text-muted-foreground mt-1">{person.bereich}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Satzung */}
      <section className="py-16 lg:py-24 bg-background" id="satzung">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-border/50">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="font-display text-2xl">Satzung & Geschäftsordnung</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Die Satzung und Geschäftsordnung des Kulturrat Braunschweig e.V. regeln 
                  unsere Arbeitsweise und Entscheidungsprozesse.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="#" 
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Satzung (PDF)
                  </a>
                  <a 
                    href="#" 
                    className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Geschäftsordnung (PDF)
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
