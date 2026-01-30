import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, Folder, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const stats = [
  { label: "Mitglieder", value: "120+", icon: Users },
  { label: "Veranstaltungen/Jahr", value: "50+", icon: Calendar },
  { label: "Ressourcen", value: "80+", icon: Folder },
];

interface HeroContent {
  title: string;
  subtitle: string;
  image_url: string | null;
  cta_text: string;
  cta_link: string;
}

const defaultContent: HeroContent = {
  title: "Gemeinsam für eine lebendige Kulturszene",
  subtitle: "Der Kulturrat Braunschweig vernetzt Kulturschaffende, bietet Ressourcen und setzt sich für die Interessen der lokalen Kulturszene ein.",
  image_url: null,
  cta_text: "Mehr erfahren",
  cta_link: "/ueber-uns",
};

export default function HeroSection() {
  const [content, setContent] = useState<HeroContent>(defaultContent);

  useEffect(() => {
    async function fetchHeroContent() {
      try {
        const { data, error } = await supabase
          .from("cms_content")
          .select("title, subtitle, image_url, cta_text, cta_link")
          .eq("block_key", "hero")
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setContent({
            title: data.title || defaultContent.title,
            subtitle: data.subtitle || defaultContent.subtitle,
            image_url: data.image_url || null,
            cta_text: data.cta_text || defaultContent.cta_text,
            cta_link: data.cta_link || defaultContent.cta_link,
          });
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      }
    }

    fetchHeroContent();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-section pb-16 pt-12 lg:pb-24 lg:pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Heart className="h-4 w-4" />
              Für die Kultur in Braunschweig
            </div>
            
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {content.title.split(" ").slice(0, 3).join(" ")}{" "}
              <span className="text-gradient">{content.title.split(" ").slice(3).join(" ")}</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              {content.subtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90 group" asChild>
                <Link to="/mitmachen">
                  Mitglied werden
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={content.cta_link}>{content.cta_text}</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                    <stat.icon className="h-5 w-5" />
                    <span className="font-display text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main visual container */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-hero opacity-20" />
              <div className="absolute inset-4 rounded-2xl bg-card shadow-card overflow-hidden">
                {content.image_url ? (
                  <>
                    <img 
                      src={content.image_url} 
                      alt="Hero" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/30 to-transparent" />
                    <div className="relative h-full p-8 flex flex-col justify-end items-center text-center">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                        Kulturelles Netzwerk
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Künstler:innen, Kulturinstitutionen und Kreative arbeiten zusammen
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <div className="relative h-full p-8 flex flex-col justify-center items-center text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 shadow-glow animate-float">
                        <Users className="h-10 w-10 text-primary-foreground" />
                      </div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                        Kulturelles Netzwerk
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Künstler:innen, Kulturinstitutionen und Kreative arbeiten zusammen
                      </p>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-6 left-6 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div className="absolute bottom-6 right-6 w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Folder className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div className="absolute top-1/4 right-6 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
