import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1]);

  return (
    <section ref={ref} className="py-24 lg:py-36 relative overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-tertiary"
      >
        {/* Abstract shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full border border-primary/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full border border-accent/10"
        />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[100px]" />
      </motion.div>

      <div className="container relative z-10">
        <motion.div
          style={{ scale }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-tertiary-foreground tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Werde Teil der{" "}
            <span className="text-gradient">Kulturszene</span>
          </motion.h2>

          <motion.p
            className="mt-8 text-xl text-tertiary-foreground/60 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Der Kulturrat lebt vom Engagement seiner Mitglieder. Bring dich ein,
            vernetze dich und gestalte Kulturpolitik mit.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-gradient-hero hover:opacity-90 group text-lg px-8 py-6"
              asChild
            >
              <Link to="/mitmachen">
                <Users className="mr-2 h-5 w-5" />
                Mitglied werden
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-tertiary-foreground/20 text-tertiary-foreground hover:bg-tertiary-foreground/10 text-lg px-8 py-6"
              asChild
            >
              <Link to="/kontakt">
                <Mail className="mr-2 h-5 w-5" />
                Kontakt aufnehmen
              </Link>
            </Button>
          </motion.div>

          <motion.p
            className="mt-10 text-sm text-tertiary-foreground/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            Kostenlose Mitgliedschaft für Einzelpersonen. Institutionen auf Anfrage.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
