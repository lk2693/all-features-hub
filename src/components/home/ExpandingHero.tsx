import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MediaItem {
  type: "image" | "video";
  url: string;
}

const defaultHeroImages = [
  "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1400&h=900&fit=crop",
  "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1400&h=900&fit=crop",
  "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1400&h=900&fit=crop",
];

export default function ExpandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  const [heroMedia, setHeroMedia] = useState<MediaItem[]>(
    defaultHeroImages.map((url) => ({ type: "image" as const, url }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [title, setTitle] = useState("Gemeinsam für eine lebendige Kulturszene");
  const [subtitle, setSubtitle] = useState(
    "Der Kulturrat Braunschweig vernetzt Kulturschaffende, bietet Ressourcen und setzt sich für die Interessen der lokalen Kulturszene ein."
  );

  useEffect(() => {
    async function fetchHero() {
      try {
        const { data } = await supabase
          .from("cms_content")
          .select("title, subtitle, image_url, metadata")
          .eq("block_key", "hero")
          .maybeSingle();
        if (data) {
          if (data.title) setTitle(data.title);
          if (data.subtitle) setSubtitle(data.subtitle);
          const meta = data.metadata as Record<string, unknown> | null;
          if (meta && Array.isArray(meta.media) && meta.media.length > 0) {
            setHeroMedia(meta.media as MediaItem[]);
          } else if (data.image_url) {
            setHeroMedia([{ type: "image", url: data.image_url }]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchHero();
  }, []);

  useEffect(() => {
    if (heroMedia.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % heroMedia.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroMedia.length]);

  const currentMedia = heroMedia[currentIndex];

  // Split title for gradient effect on last words
  const words = title.split(" ");
  const firstPart = words.slice(0, 3).join(" ");
  const lastPart = words.slice(3).join(" ");

  return (
    <motion.section
      ref={containerRef}
      className="relative overflow-hidden"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "100vh", opacity: 1 }}
      transition={{
        height: { duration: 1, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.6, delay: 0.3 },
      }}
    >
      {/* Parallax background */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {currentMedia?.type === "video" ? (
          <video
            key={currentMedia.url}
            src={currentMedia.url}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.img
            key={currentMedia?.url}
            src={currentMedia?.url}
            alt=""
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        )}
      </motion.div>

      {/* Dramatic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-transparent to-transparent" />

      {/* Content with parallax */}
      <motion.div
        style={{ y: textY, opacity }}
        className="absolute inset-0 flex items-end pb-20 lg:pb-28"
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0, 1] }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 text-sm font-medium text-white mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Heart className="h-4 w-4" />
              Für die Kultur in Braunschweig
            </motion.div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight max-w-5xl">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="block"
              >
                {firstPart}
              </motion.span>
              {lastPart && (
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="block text-gradient"
                >
                  {lastPart}
                </motion.span>
              )}
            </h1>

            <motion.p
              className="mt-8 text-lg lg:text-xl text-white/70 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {subtitle}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <Button size="lg" className="bg-gradient-hero hover:opacity-90 group text-lg px-8 py-6" asChild>
                <Link to="/mitmachen">
                  Mitglied werden
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/15 backdrop-blur-sm text-lg px-8 py-6"
                asChild
              >
                <Link to="/ueber-uns">Mehr erfahren</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Image indicators */}
      {heroMedia.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-2 z-10">
          {heroMedia.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentIndex ? "bg-primary-foreground w-10" : "bg-primary-foreground/30 w-4 hover:bg-primary-foreground/60"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
