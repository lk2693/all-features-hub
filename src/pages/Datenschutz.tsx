import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { 
  Cookie, 
  Shield, 
  BarChart3, 
  Megaphone, 
  Server, 
  Lock, 
  Mail, 
  Users, 
  FileText, 
  Clock,
  ExternalLink
} from "lucide-react";

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
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl mb-4">
              Datenschutzerklärung
            </h1>
            <p className="text-lg text-muted-foreground">
              Informationen zum Schutz Ihrer personenbezogenen Daten gemäß DSGVO
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container max-w-3xl">
          <div className="prose prose-lg space-y-12">
            
            {/* 1. Datenschutz auf einen Blick */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                1. Datenschutz auf einen Blick
              </h2>
              <p className="text-muted-foreground mb-4">
                Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten 
                vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>
              <p className="text-muted-foreground">
                Die Nutzung unserer Website ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren 
                Seiten personenbezogene Daten (z.B. Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies stets 
                auf freiwilliger Basis.
              </p>
            </div>

            {/* 2. Verantwortliche Stelle */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                2. Verantwortliche Stelle
              </h2>
              <div className="bg-muted/30 rounded-lg p-6 border border-border">
                <p className="text-foreground font-medium mb-2">Kulturrat Braunschweig e.V.</p>
                <p className="text-muted-foreground mb-4">
                  Musterstraße 1<br />
                  38100 Braunschweig<br />
                  Deutschland
                </p>
                <p className="text-muted-foreground">
                  <strong>E-Mail:</strong> info@kulturrat-braunschweig.de<br />
                  <strong>Telefon:</strong> +49 531 123456
                </p>
              </div>
              <p className="text-muted-foreground mt-4">
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen 
                über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.
              </p>
            </div>

            {/* 3. Hosting und Cloud-Dienste */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                <Server className="h-6 w-6 text-primary" />
                3. Hosting und Cloud-Dienste
              </h2>
              <p className="text-muted-foreground mb-4">
                Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, 
                die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.
              </p>
              <p className="text-muted-foreground mb-4">
                Hierbei kann es sich v.a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, 
                Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website 
                generiert werden, handeln.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Rechtsgrundlage:</strong> Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. 
                  Unser berechtigtes Interesse besteht in einer zuverlässigen Darstellung unserer Website.
                </p>
              </div>
              <p className="text-muted-foreground mt-4">
                Wir setzen für die Bereitstellung unserer Website folgenden Hoster ein: Die Server befinden sich 
                in Rechenzentren innerhalb der EU und unterliegen den europäischen Datenschutzstandards.
              </p>
            </div>

            {/* 4. SSL/TLS-Verschlüsselung */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                4. SSL/TLS-Verschlüsselung
              </h2>
              <p className="text-muted-foreground">
                Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, 
                wie zum Beispiel Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. 
                Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf 
                „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
              </p>
            </div>

            {/* 5. Datenerfassung auf dieser Website */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                5. Datenerfassung auf dieser Website
              </h2>
              
              <h3 className="font-display text-xl font-medium mt-6 mb-3">Server-Log-Dateien</h3>
              <p className="text-muted-foreground mb-4">
                Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, 
                die Ihr Browser automatisch an uns übermittelt. Dies sind:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                <li>Browsertyp und Browserversion</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p className="text-muted-foreground">
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. 
                Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
              </p>

              <h3 className="font-display text-xl font-medium mt-6 mb-3">Kontaktformular</h3>
              <p className="text-muted-foreground mb-4">
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular 
                inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall 
                von Anschlussfragen bei uns gespeichert.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Rechtsgrundlage:</strong> Die Verarbeitung der Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO 
                  (Vertragsanbahnung) oder Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
                </p>
              </div>

              <h3 className="font-display text-xl font-medium mt-6 mb-3">Newsletter</h3>
              <p className="text-muted-foreground mb-4">
                Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine 
                E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der 
                angegebenen E-Mail-Adresse sind.
              </p>
              <p className="text-muted-foreground">
                Die Anmeldung erfolgt über das Double-Opt-In-Verfahren. Sie können den Newsletter jederzeit über den 
                entsprechenden Link im Newsletter oder per E-Mail an uns abbestellen.
              </p>

              <h3 className="font-display text-xl font-medium mt-6 mb-3">Registrierung auf dieser Website</h3>
              <p className="text-muted-foreground">
                Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen zu nutzen. Die dabei 
                eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes oder Dienstes. 
                Die bei der Registrierung abgefragten Pflichtangaben müssen vollständig angegeben werden.
              </p>
            </div>

            {/* 6. Cookies */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                <Cookie className="h-6 w-6 text-primary" />
                6. Cookies
              </h2>
              <p className="text-muted-foreground mb-6">
                Diese Website verwendet Cookies in verschiedenen Kategorien. Cookies sind kleine Textdateien, 
                die auf Ihrem Endgerät gespeichert werden. Sie können Ihre Einstellungen jederzeit anpassen.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
                  <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Notwendige Cookies</p>
                    <p className="text-sm text-muted-foreground">
                      Diese Cookies sind für die Grundfunktionen der Website erforderlich, z.B. für die Anmeldung, 
                      Sicherheit und Speicherung Ihrer Cookie-Präferenzen. Sie können nicht deaktiviert werden.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Speicherdauer:</strong> Session oder bis zu 1 Jahr
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
                  <BarChart3 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Statistik-Cookies</p>
                    <p className="text-sm text-muted-foreground">
                      Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren. 
                      Die Daten werden anonymisiert erfasst und dienen der Verbesserung unserer Angebote.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Speicherdauer:</strong> bis zu 2 Jahre
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
                  <Megaphone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Marketing-Cookies</p>
                    <p className="text-sm text-muted-foreground">
                      Diese Cookies ermöglichen personalisierte Inhalte und Newsletter-Tracking, 
                      um Ihnen relevante Informationen zu zeigen.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Speicherdauer:</strong> bis zu 1 Jahr
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 border border-border mb-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Rechtsgrundlage:</strong> Die Nutzung von Cookies erfolgt auf Grundlage Ihrer Einwilligung 
                  (Art. 6 Abs. 1 lit. a DSGVO) oder auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO) 
                  bei technisch notwendigen Cookies.
                </p>
              </div>

              <Button onClick={resetConsent} className="bg-gradient-hero hover:opacity-90">
                <Cookie className="mr-2 h-4 w-4" />
                Cookie-Einstellungen ändern
              </Button>
            </div>

            {/* 7. Ihre Rechte */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                7. Ihre Rechte
              </h2>
              <p className="text-muted-foreground mb-4">
                Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
              </p>
              
              <div className="grid gap-3 mb-6">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Recht auf Auskunft (Art. 15 DSGVO)</p>
                    <p className="text-sm text-muted-foreground">
                      Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten verlangen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Recht auf Berichtigung (Art. 16 DSGVO)</p>
                    <p className="text-sm text-muted-foreground">
                      Sie können die Berichtigung unrichtiger oder Vervollständigung Ihrer Daten verlangen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Recht auf Löschung (Art. 17 DSGVO)</p>
                    <p className="text-sm text-muted-foreground">
                      Sie können die Löschung Ihrer bei uns gespeicherten Daten verlangen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Recht auf Einschränkung (Art. 18 DSGVO)</p>
                    <p className="text-sm text-muted-foreground">
                      Sie können die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten verlangen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">5</span>
                  </div>
                  <div>
                    <p className="font-medium">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</p>
                    <p className="text-sm text-muted-foreground">
                      Sie können verlangen, dass wir Ihnen Ihre Daten in einem strukturierten Format übermitteln.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">6</span>
                  </div>
                  <div>
                    <p className="font-medium">Widerspruchsrecht (Art. 21 DSGVO)</p>
                    <p className="text-sm text-muted-foreground">
                      Sie können der Verarbeitung Ihrer personenbezogenen Daten widersprechen.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">
                Zur Geltendmachung Ihrer Rechte können Sie sich jederzeit an uns wenden.
              </p>
            </div>

            {/* 8. Speicherdauer */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                8. Speicherdauer
              </h2>
              <p className="text-muted-foreground mb-4">
                Sofern innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, 
                verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
              </p>
              <p className="text-muted-foreground">
                Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung 
                widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für 
                die Speicherung Ihrer personenbezogenen Daten haben.
              </p>
            </div>

            {/* 9. Beschwerderecht */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                9. Beschwerderecht bei der Aufsichtsbehörde
              </h2>
              <p className="text-muted-foreground mb-4">
                Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht 
                Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu, wenn Sie der Ansicht sind, dass 
                die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die DSGVO verstößt.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Zuständige Aufsichtsbehörde:</strong><br />
                  Die Landesbeauftragte für den Datenschutz Niedersachsen<br />
                  Prinzenstraße 5<br />
                  30159 Hannover<br />
                  <a 
                    href="https://www.lfd.niedersachsen.de" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    www.lfd.niedersachsen.de
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
            </div>

            {/* 10. Änderungen */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4">
                10. Änderungen dieser Datenschutzerklärung
              </h2>
              <p className="text-muted-foreground mb-4">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen 
                rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Stand:</strong> Januar 2026
              </p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
