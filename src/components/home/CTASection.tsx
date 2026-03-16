import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Mail } from "lucide-react";
import { useRef } from "react";

import ctaImage from "@/assets/cta-kulturszene.jpg";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section ref={ref} className="py-24 lg:py-36 bg-background">
      <div className="container">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-end">
          {/* Background image with parallax */}
          <motion.img
            src={ctaImage}
            alt="Kulturfestival in der Stadt"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ scale: imgScale, y: imgY }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/10" />

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 w-full max-w-3xl">
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-primary/90 text-primary-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Jetzt mitmachen
            </motion.span>

            <motion.h2
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Werde Teil der Kulturszene
            </motion.h2>

            <motion.p
              className="mt-5 text-lg sm:text-xl text-background/70 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              Der Kulturrat lebt vom Engagement seiner Mitglieder. Bring dich ein,
              vernetze dich und gestalte Kulturpolitik mit.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Link
                to="/mitmachen"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <Users className="h-4 w-4" />
                Mitglied werden
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-background/30 text-background font-semibold text-sm hover:bg-background/10 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Kontakt aufnehmen
              </Link>
            </motion.div>

            <motion.p
              className="mt-8 text-xs text-background/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              Kostenlose Mitgliedschaft für Einzelpersonen · Institutionen auf Anfrage
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
