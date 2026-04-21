import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Mail } from "lucide-react";
import { useRef } from "react";

import ctaImage from "@/assets/cta-kulturszene.jpg";
import { useCMSContent } from "@/hooks/useCMSContent";

interface PreviewData {
  title?: string | null;
  subtitle?: string | null;   // shown as small badge above title
  content?: string | null;    // body text
  image_url?: string | null;
  primary_cta_text?: string | null;
  primary_cta_link?: string | null;
  secondary_cta_text?: string | null;
  secondary_cta_link?: string | null;
  footer_note?: string | null;
}

export default function CTASection({ previewData }: { previewData?: PreviewData } = {}) {
  const { content } = useCMSContent("cta");
  const meta = (content.metadata ?? {}) as Record<string, string>;

  const title = previewData?.title ?? content.title ?? "Werde Teil der Kulturszene";
  const badge = previewData?.subtitle ?? content.subtitle ?? "Jetzt mitmachen";
  const body = previewData?.content ?? content.content ?? "Der Kulturrat lebt vom Engagement seiner Mitglieder. Bring dich ein, vernetze dich und gestalte Kulturpolitik mit.";
  const image = previewData?.image_url ?? content.image_url ?? ctaImage;
  const primaryText = previewData?.primary_cta_text ?? meta.primary_cta_text ?? "Mitglied werden";
  const primaryLink = previewData?.primary_cta_link ?? meta.primary_cta_link ?? "/mitmachen";
  const secondaryText = previewData?.secondary_cta_text ?? meta.secondary_cta_text ?? "Kontakt aufnehmen";
  const secondaryLink = previewData?.secondary_cta_link ?? meta.secondary_cta_link ?? "/kontakt";
  const footerNote = previewData?.footer_note ?? meta.footer_note ?? "Kostenlose Mitgliedschaft für Einzelpersonen · Institutionen auf Anfrage";

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
            src={image}
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
              {badge}
            </motion.span>

            <motion.h2
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {title}
            </motion.h2>

            <motion.p
              className="mt-5 text-lg sm:text-xl text-background/70 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              {body}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Link
                to={primaryLink}
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <Users className="h-4 w-4" />
                {primaryText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to={secondaryLink}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-background/30 text-background font-semibold text-sm hover:bg-background/10 transition-colors"
              >
                <Mail className="h-4 w-4" />
                {secondaryText}
              </Link>
            </motion.div>

            <motion.p
              className="mt-8 text-xs text-background/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              {footerNote}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
