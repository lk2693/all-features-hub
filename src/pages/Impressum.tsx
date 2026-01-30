import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";

export default function Impressum() {
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
              Impressum
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container max-w-3xl">
          <div className="prose prose-lg">
            <h2 className="font-display text-2xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
            <p className="text-muted-foreground mb-6">
              Kulturrat Braunschweig e.V.<br />
              c/o Kulturzentrum<br />
              Musterstraße 1<br />
              38100 Braunschweig
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">Vertreten durch</h2>
            <p className="text-muted-foreground mb-6">
              Dr. Maria Schmidt (1. Vorsitzende)<br />
              Thomas Müller (2. Vorsitzender)
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">Kontakt</h2>
            <p className="text-muted-foreground mb-6">
              E-Mail: info@kulturrat-braunschweig.de
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">Registereintrag</h2>
            <p className="text-muted-foreground mb-6">
              Eintragung im Vereinsregister<br />
              Registergericht: Amtsgericht Braunschweig<br />
              Registernummer: VR XXXXX
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="text-muted-foreground mb-6">
              Dr. Maria Schmidt<br />
              Kulturrat Braunschweig e.V.<br />
              Musterstraße 1<br />
              38100 Braunschweig
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">Haftungsausschluss</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Haftung für Inhalte:</strong> Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. 
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            </p>
            <p className="text-muted-foreground mb-6">
              <strong>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Webseiten Dritter, 
              auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
