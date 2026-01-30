import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Kontakt() {
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
              Kontakt
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Du hast Fragen, Anregungen oder möchtest mit uns zusammenarbeiten? 
              Wir freuen uns, von dir zu hören!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1 space-y-6"
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-display text-lg">E-Mail</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="mailto:info@kulturrat-braunschweig.de" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    info@kulturrat-braunschweig.de
                  </a>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-2">
                    <MapPin className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-display text-lg">Adresse</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>Kulturrat Braunschweig e.V.</p>
                  <p>c/o Kulturzentrum</p>
                  <p>Musterstraße 1</p>
                  <p>38100 Braunschweig</p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="font-display text-lg">Erreichbarkeit</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>Der Kulturrat wird ehrenamtlich geführt.</p>
                  <p className="mt-2">Wir antworten in der Regel innerhalb von 2-3 Werktagen.</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Schreib uns</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" placeholder="Dein Name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail *</Label>
                        <Input id="email" type="email" placeholder="deine@email.de" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Betreff</Label>
                      <Select>
                        <SelectTrigger>
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
                      <Label htmlFor="message">Nachricht *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Deine Nachricht an uns..." 
                        rows={6}
                        required 
                      />
                    </div>

                    <div className="flex items-start gap-3 text-sm text-muted-foreground">
                      <input type="checkbox" id="privacy" className="mt-1" required />
                      <label htmlFor="privacy">
                        Ich habe die{" "}
                        <a href="/datenschutz" className="text-primary hover:underline">
                          Datenschutzerklärung
                        </a>{" "}
                        gelesen und stimme der Verarbeitung meiner Daten zu. *
                      </label>
                    </div>

                    <Button type="submit" size="lg" className="bg-gradient-hero hover:opacity-90">
                      <Send className="mr-2 h-4 w-4" />
                      Nachricht senden
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
