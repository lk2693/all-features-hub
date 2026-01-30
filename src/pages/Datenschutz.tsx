import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { Cookie, Shield, BarChart3, Megaphone } from "lucide-react";

export default function Datenschutz() {
  const { resetConsent } = useCookieConsent();

  return (
    <Layout>
      <section className="py-16 lg:py-24 bg-gradient-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl mb-8">
              Datenschutzerklärung
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container max-w-3xl">
          <div className="prose prose-lg">
            <h2 className="font-display text-2xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
            <p className="text-muted-foreground mb-6">
              Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten 
              vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">2. Verantwortliche Stelle</h2>
            <p className="text-muted-foreground mb-6">
              Kulturrat Braunschweig e.V.<br />
              Musterstraße 1<br />
              38100 Braunschweig<br />
              E-Mail: info@kulturrat-braunschweig.de
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">3. Datenerfassung auf unserer Website</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Kontaktformular:</strong> Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, 
              werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten 
              zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
            </p>
            <p className="text-muted-foreground mb-6">
              <strong>Newsletter:</strong> Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, 
              benötigen wir von Ihnen eine E-Mail-Adresse. Die Anmeldung erfolgt über das Double-Opt-In-Verfahren.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">4. Ihre Rechte</h2>
            <p className="text-muted-foreground mb-6">
              Sie haben jederzeit das Recht auf Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten, 
              deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung. Sie haben außerdem ein Recht 
              auf Berichtigung, Sperrung oder Löschung dieser Daten.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
              <Cookie className="h-6 w-6 text-primary" />
              5. Cookies
            </h2>
            <p className="text-muted-foreground mb-6">
              Diese Website verwendet Cookies in verschiedenen Kategorien. Du kannst deine Einstellungen jederzeit anpassen.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
                <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Notwendige Cookies</p>
                  <p className="text-sm text-muted-foreground">
                    Diese Cookies sind für die Grundfunktionen der Website erforderlich, z.B. für die Anmeldung und Sicherheit. Sie können nicht deaktiviert werden.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
                <BarChart3 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Statistik-Cookies</p>
                  <p className="text-sm text-muted-foreground">
                    Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren. Die Daten werden anonymisiert erfasst.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
                <Megaphone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Marketing-Cookies</p>
                  <p className="text-sm text-muted-foreground">
                    Diese Cookies ermöglichen personalisierte Inhalte und Newsletter-Tracking, um dir relevante Informationen zu zeigen.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={resetConsent} className="bg-gradient-hero hover:opacity-90">
              <Cookie className="mr-2 h-4 w-4" />
              Cookie-Einstellungen ändern
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
