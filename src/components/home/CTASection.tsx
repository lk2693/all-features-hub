import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-tertiary text-tertiary-foreground overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Werde Teil der{" "}
            <span className="text-gradient">Kulturszene</span>
          </h2>
          <p className="mt-6 text-lg text-tertiary-foreground/70 leading-relaxed">
            Der Kulturrat Braunschweig lebt vom Engagement seiner Mitglieder. 
            Bring dich ein, vernetze dich und gestalte die Kulturpolitik in unserer Stadt mit.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-hero hover:opacity-90 group"
              asChild
            >
              <Link to="/mitmachen">
                <Users className="mr-2 h-5 w-5" />
                Mitglied werden
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-tertiary-foreground/20 text-tertiary-foreground hover:bg-tertiary-foreground/10"
              asChild
            >
              <Link to="/kontakt">
                <Mail className="mr-2 h-5 w-5" />
                Kontakt aufnehmen
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-tertiary-foreground/50">
            Kostenlose Mitgliedschaft für Einzelpersonen. Institutionen auf Anfrage.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
