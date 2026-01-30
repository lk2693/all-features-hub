import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCMSContent } from "@/hooks/useCMSContent";

const heroImages = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
];

export default function ExpandingHero() {
  const { content: heroContent } = useCMSContent("ueberuns_hero");
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        className="relative min-h-[60vh] lg:min-h-[70vh]"
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
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
        </div>

        {/* Content */}
        <div className="container relative z-10 flex items-center min-h-[60vh] lg:min-h-[70vh] py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-3xl"
          >
            <motion.h1 
              className="font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {heroContent.title?.split(" ").slice(0, 2).join(" ")}{" "}
              <span className="text-gradient">
                {heroContent.title?.split(" ").slice(2).join(" ")}
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {heroContent.subtitle}
            </motion.p>
          </motion.div>
        </div>

        {/* Image indicators */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ delay: 1.2 }}
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
