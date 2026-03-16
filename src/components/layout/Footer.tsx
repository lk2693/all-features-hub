import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import newsletterImage from "@/assets/newsletter-kultur.jpg";

const footerLinks = {
  kulturrat: [
    { name: "Über uns", href: "/ueber-uns" },
    { name: "Vorstand", href: "/ueber-uns#vorstand" },
    { name: "Satzung", href: "/ueber-uns#satzung" },
    { name: "Leitbild", href: "/ueber-uns#leitbild" },
  ],
  angebote: [
    { name: "News & Blog", href: "/news" },
    { name: "Best Practices", href: "/best-practices" },
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
    <footer className="bg-foreground text-background">
      {/* Newsletter Band */}
      <div className="border-b border-background/10">
        <div className="container py-14 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Bleib in der{" "}
                <span className="text-primary">Szene</span>
              </h3>
              <p className="mt-3 text-background/50 text-sm leading-relaxed">
                Kulturpolitik, Förderungen und Veranstaltungen – direkt in dein Postfach.
              </p>
            </div>
            <NewsletterSignup className="w-full max-w-md" />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-14 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary">
                <span className="font-display text-lg font-bold text-primary-foreground">K</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold">Kulturrat</p>
                <p className="text-xs text-background/40">Braunschweig</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-background/40 leading-relaxed">
              Die Stimme der Kulturschaffenden in Braunschweig.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-background/10 text-background/50 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="sr-only">{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries({
            Kulturrat: footerLinks.kulturrat,
            Angebote: footerLinks.angebote,
            Mitmachen: footerLinks.mitmachen,
            Rechtliches: footerLinks.rechtliches,
          }).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-xs uppercase tracking-[0.15em] text-background/30 mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {"isCookieSettings" in link && link.isCookieSettings ? (
                      <button
                        onClick={resetConsent}
                        className="text-sm text-background/50 hover:text-background transition-colors duration-200 text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-background/50 hover:text-background transition-colors duration-200"
                      >
                        {link.name}
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/30">
            © {new Date().getFullYear()} Kulturrat Braunschweig e.V.
          </p>
          <span className="flex items-center gap-1.5 text-xs text-background/30">
            <MapPin className="h-3 w-3" />
            Braunschweig, Deutschland
          </span>
        </div>
      </div>
    </footer>
  );
}
