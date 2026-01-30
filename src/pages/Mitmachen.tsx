import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Users, UserPlus, Handshake, FileCheck, ArrowRight, Check, MessageSquare, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const membershipBenefits = [
  "Stimmrecht in Vollversammlungen",
  "Zugang zu Ressourcenpool",
  "Newsletter & exklusive Infos",
  "Netzwerk & Austausch",
  "Beratung zu Förderungen",
  "Mitarbeit in AGs",
];

const ags = [
  {
    name: "AG Kulturpolitik",
    description: "Erarbeitet Stellungnahmen und vertritt die Interessen der Kulturszene gegenüber Politik und Verwaltung.",
    members: 12,
    nextMeeting: "18. März 2025",
  },
  {
    name: "AG Förderung",
    description: "Sammelt Infos zu Fördermöglichkeiten und organisiert Workshops zum Thema Antragsstellung.",
    members: 8,
    nextMeeting: "25. März 2025",
  },
  {
    name: "AG Öffentlichkeitsarbeit",
    description: "Kümmert sich um Website, Social Media und die Außendarstellung des Kulturrats.",
    members: 6,
    nextMeeting: "10. März 2025",
  },
  {
    name: "AG Ressourcen",
    description: "Pflegt den Ressourcenpool und entwickelt neue Angebote für Kulturschaffende.",
    members: 5,
    nextMeeting: "20. März 2025",
  },
];

export default function Mitmachen() {
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
              Mitmachen
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Werde Teil des Kulturrats Braunschweig. Vernetze dich, bring dich ein und gestalte die Kulturpolitik unserer Stadt mit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Membership */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <UserPlus className="h-4 w-4" />
                Mitgliedschaft
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Mitglied werden
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Die Mitgliedschaft im Kulturrat Braunschweig steht allen Kulturschaffenden, 
                Künstler:innen, Kulturinstitutionen und kulturinteressierten Personen offen. 
                Die Mitgliedschaft für Einzelpersonen ist kostenlos.
              </p>

              <h3 className="font-display text-lg font-semibold mb-4">
                Deine Vorteile als Mitglied:
              </h3>
              <ul className="space-y-3 mb-8">
                {membershipBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button size="lg" className="bg-gradient-hero hover:opacity-90" asChild>
                <Link to="/kontakt">
                  Jetzt Mitglied werden
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                    <FileCheck className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <CardTitle className="font-display text-xl">So wirst du Mitglied</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Kontakt aufnehmen</h4>
                      <p className="text-sm text-muted-foreground">
                        Schreib uns über das Kontaktformular oder per E-Mail.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Antrag ausfüllen</h4>
                      <p className="text-sm text-muted-foreground">
                        Wir senden dir den Mitgliedsantrag zu.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Willkommen!</h4>
                      <p className="text-sm text-muted-foreground">
                        Nach Bestätigung bist du offiziell Mitglied.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Arbeitsgruppen */}
      <section className="py-16 lg:py-24 bg-gradient-section" id="ags">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent-foreground mb-6">
              <Handshake className="h-4 w-4" />
              Arbeitsgruppen
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Engagiere dich in einer AG
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              In unseren Arbeitsgruppen kannst du aktiv an der Arbeit des Kulturrats mitwirken.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {ags.map((ag, index) => (
              <motion.div
                key={ag.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:shadow-card transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="font-display text-xl">{ag.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{ag.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 text-primary" />
                        {ag.members} Mitglieder
                      </span>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        Nächstes Treffen: {ag.nextMeeting}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-tertiary text-tertiary-foreground">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl font-bold sm:text-4xl mb-6">
              Fragen? Wir helfen gerne!
            </h2>
            <p className="text-tertiary-foreground/70 mb-8">
              Du hast Fragen zur Mitgliedschaft oder möchtest mehr über unsere Arbeit erfahren? 
              Kontaktiere uns – wir freuen uns auf dich!
            </p>
            <Button size="lg" variant="outline" className="border-tertiary-foreground/20 text-tertiary-foreground hover:bg-tertiary-foreground/10" asChild>
              <Link to="/kontakt">
                <MessageSquare className="mr-2 h-5 w-5" />
                Kontakt aufnehmen
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
