import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import kontaktHero from "@/assets/kontakt-hero.jpg";

const contactInfo = [
  {
    icon: Mail,
    title: "E-Mail",
    style: "bg-primary/10 text-primary",
    content: (
      <a href="mailto:info@kulturrat-braunschweig.de" className="text-sm text-muted-foreground hover:text-primary transition-colors">
        info@kulturrat-braunschweig.de
      </a>
    ),
  },
  {
    icon: MapPin,
    title: "Adresse",
    style: "bg-accent/30 text-accent-foreground",
    content: (
      <div className="text-sm text-muted-foreground space-y-0.5">
        <p>Kulturrat Braunschweig e.V.</p>
        <p>c/o Kulturzentrum</p>
        <p>Musterstraße 1</p>
        <p>38100 Braunschweig</p>
      </div>
    ),
  },
  {
    icon: Clock,
    title: "Erreichbarkeit",
    style: "bg-secondary text-secondary-foreground",
    content: (
      <div className="text-sm text-muted-foreground space-y-1">
        <p>Ehrenamtlich geführt.</p>
        <p>Antwort innerhalb von 2–3 Werktagen.</p>
      </div>
    ),
  },
];

export default function Kontakt() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <img src={kontaktHero} alt="Kontakt" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />

        <div className="container relative z-10 pb-14 pt-36">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/90 text-primary-foreground mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Kontakt
          </motion.span>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Schreib uns
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-background/60 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Du hast Fragen, Anregungen oder möchtest mit uns zusammenarbeiten? Wir freuen uns, von dir zu hören!
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-4"
            >
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-primary mb-6">
                So erreichst du uns
              </h2>
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/20 transition-all duration-300"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.style)}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                    {item.content}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-3"
            >
              <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Nachricht senden</h2>

                <form className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                      <input
                        id="name"
                        placeholder="Dein Name"
                        required
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">E-Mail *</Label>
                      <input
                        id="email"
                        type="email"
                        placeholder="deine@email.de"
                        required
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">Betreff</Label>
                    <Select>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Wähle ein Thema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mitgliedschaft">Mitgliedschaft</SelectItem>
                        <SelectItem value="presse">Presseanfrage</SelectItem>
                        <SelectItem value="kooperation">Kooperationsanfrage</SelectItem>
                        <SelectItem value="ressourcen">Ressourcenpool</SelectItem>
                        <SelectItem value="foerderung">Förderberatung</SelectItem>
                        <SelectItem value="sonstiges">Sonstiges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">Nachricht *</Label>
                    <textarea
                      id="message"
                      placeholder="Deine Nachricht an uns..."
                      rows={6}
                      required
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <input type="checkbox" id="privacy" className="mt-1 accent-primary" required />
                    <label htmlFor="privacy">
                      Ich habe die{" "}
                      <a href="/datenschutz" className="text-primary hover:underline font-medium">
                        Datenschutzerklärung
                      </a>{" "}
                      gelesen und stimme der Verarbeitung meiner Daten zu. *
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    <Send className="h-4 w-4" />
                    Nachricht senden
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
