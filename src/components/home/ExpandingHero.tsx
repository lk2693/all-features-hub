import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, Folder, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const defaultHeroImages = [
  "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1400&h=900&fit=crop",
  "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1400&h=900&fit=crop",
  "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1400&h=900&fit=crop",
];

const stats = [
  { label: "Mitglieder", value: "120+", icon: Users },
  { label: "Veranstaltungen/Jahr", value: "50+", icon: Calendar },
  { label: "Ressourcen", value: "80+", icon: Folder },
];

interface HeroContent {
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string | null;
}

const defaultContent: HeroContent = {
  title: "Gemeinsam für eine lebendige Kulturszene",
  subtitle: "Der Kulturrat Braunschweig vernetzt Kulturschaffende, bietet Ressourcen und setzt sich für die Interessen der lokalen Kulturszene ein.",
  cta_text: "Mehr erfahren",
  cta_link: "/ueber-uns",
  image_url: null,
};

export default function ExpandingHero() {
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [heroImages, setHeroImages] = useState<string[]>(defaultHeroImages);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch CMS content
  useEffect(() => {
    async function fetchHeroContent() {
      try {
        const { data, error } = await supabase
          .from("cms_content")
          .select("title, subtitle, cta_text, cta_link, image_url")
          .eq("block_key", "hero")
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setContent({
            title: data.title || defaultContent.title,
            subtitle: data.subtitle || defaultContent.subtitle,
            cta_text: data.cta_text || defaultContent.cta_text,
            cta_link: data.cta_link || defaultContent.cta_link,
            image_url: data.image_url || null,
          });
          
          // Wenn ein CMS-Bild vorhanden ist, verwende nur dieses
          if (data.image_url) {
            setHeroImages([data.image_url]);
          }
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      }
    }

    fetchHeroContent();
  }, []);

  // Trigger expansion on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Expanding container */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ 
          height: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.6, delay: 0.2 }
        }}
        className="relative min-h-[70vh] lg:min-h-[80vh]"
      >
        {/* Background images with crossfade */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[currentImageIndex]}
                alt=""
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="container relative z-10 flex items-center min-h-[70vh] lg:min-h-[80vh] py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-3xl"
          >
            <motion.div 
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Heart className="h-4 w-4" />
              Für die Kultur in Braunschweig
            </motion.div>

            <motion.h1 
              className="font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {content.title.split(" ").slice(0, 3).join(" ")}{" "}
              <span className="text-gradient">
                {content.title.split(" ").slice(3).join(" ")}
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {content.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <Button size="lg" className="bg-gradient-hero hover:opacity-90 group" asChild>
                <Link to="/mitmachen">
                  Mitglied werden
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="backdrop-blur-sm" asChild>
                <Link to={content.cta_link}>{content.cta_text}</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="mt-12 grid grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                    <stat.icon className="h-5 w-5" />
                    <span className="font-display text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Image indicators */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ delay: 1.5 }}
        >
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? "bg-primary w-8" 
                  : "bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Bild ${index + 1} anzeigen`}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
