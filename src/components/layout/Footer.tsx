import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail, MapPin } from "lucide-react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const footerLinks = {
  kulturrat: [
    { name: "Über uns", href: "/ueber-uns" },
    { name: "Vorstand", href: "/ueber-uns#vorstand" },
    { name: "Satzung", href: "/ueber-uns#satzung" },
    { name: "Leitbild", href: "/ueber-uns#leitbild" },
  ],
  angebote: [
    { name: "News & Blog", href: "/news" },
    { name: "Kalender", href: "/kalender" },
    { name: "Ressourcenpool", href: "/ressourcen" },
    { name: "Förderinfos", href: "/foerderung" },
  ],
  mitmachen: [
    { name: "Mitglied werden", href: "/mitmachen" },
    { name: "AGs & Projekte", href: "/mitmachen#ags" },
    { name: "Ressource eintragen", href: "/ressourcen/eintragen" },
    { name: "Kontakt", href: "/kontakt" },
  ],
  rechtliches: [
    { name: "Impressum", href: "/impressum" },
    { name: "Datenschutz", href: "/datenschutz" },
    { name: "Barrierefreiheit", href: "/barrierefreiheit" },
    { name: "Presse", href: "/presse" },
    { name: "Cookie-Einstellungen", href: "#cookies", isCookieSettings: true },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/kulturrat.bs" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@kulturratbs" },
  { name: "E-Mail", icon: Mail, href: "mailto:info@kulturrat-braunschweig.de" },
];

export default function Footer() {
  const { resetConsent } = useCookieConsent();

  return (
    <footer className="border-t border-border bg-tertiary text-tertiary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-tertiary-foreground/10">
        <div className="container py-12">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <h3 className="font-display text-2xl font-semibold">Newsletter abonnieren</h3>
              <p className="mt-1 text-tertiary-foreground/70">
                Bleib auf dem Laufenden über Kulturpolitik, Förderungen und Veranstaltungen.
              </p>
            </div>
            <NewsletterSignup className="w-full max-w-md" />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero">
                <span className="font-display text-lg font-bold text-primary-foreground">K</span>
              </div>
              <div>
                <p className="font-display text-lg font-semibold">Kulturrat</p>
                <p className="text-xs text-tertiary-foreground/70">Braunschweig</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-tertiary-foreground/70 leading-relaxed">
              Die Stimme der Kulturschaffenden in Braunschweig. Netzwerk, Interessenvertretung und Ressourcenplattform.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-foreground/10 text-tertiary-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-tertiary-foreground/50 mb-4">
              Kulturrat
            </h4>
            <ul className="space-y-3">
              {footerLinks.kulturrat.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-tertiary-foreground/70 hover:text-tertiary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-tertiary-foreground/50 mb-4">
              Angebote
            </h4>
            <ul className="space-y-3">
              {footerLinks.angebote.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-tertiary-foreground/70 hover:text-tertiary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-tertiary-foreground/50 mb-4">
              Mitmachen
            </h4>
            <ul className="space-y-3">
              {footerLinks.mitmachen.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-tertiary-foreground/70 hover:text-tertiary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-tertiary-foreground/50 mb-4">
              Rechtliches
            </h4>
            <ul className="space-y-3">
              {footerLinks.rechtliches.map((link) => (
                <li key={link.name}>
                  {"isCookieSettings" in link && link.isCookieSettings ? (
                    <button
                      onClick={resetConsent}
                      className="text-sm text-tertiary-foreground/70 hover:text-tertiary-foreground transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-tertiary-foreground/70 hover:text-tertiary-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-tertiary-foreground/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-tertiary-foreground/50">
          <p>© 2025 Kulturrat Braunschweig e.V. Alle Rechte vorbehalten.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Braunschweig
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
