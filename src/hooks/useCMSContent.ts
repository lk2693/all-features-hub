import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CMSContent {
  title: string | null;
  subtitle: string | null;
  content: string | null;
  cta_text: string | null;
  cta_link: string | null;
}

const defaultContent: Record<string, CMSContent> = {
  hero: {
    title: "Gemeinsam für Kultur in Braunschweig",
    subtitle: "Der Kulturrat Braunschweig vernetzt Kulturschaffende, fördert den Austausch und stärkt die kulturelle Vielfalt unserer Stadt.",
    content: null,
    cta_text: "Mehr erfahren",
    cta_link: "/ueber-uns",
  },
  ueberuns_hero: {
    title: "Über den Kulturrat",
    subtitle: "Der Kulturrat Braunschweig ist die Interessenvertretung der Kulturschaffenden in Braunschweig. Wir vernetzen, beraten und setzen uns für die Belange der lokalen Kulturszene ein.",
    content: null,
    cta_text: null,
    cta_link: null,
  },
  ueberuns_mission: {
    title: "Unsere Mission",
    subtitle: null,
    content: "Wir stärken die kulturelle Vielfalt in Braunschweig, indem wir Kulturschaffende vernetzen, ihre Interessen vertreten und Ressourcen bündeln. Als unabhängige Stimme der Kulturszene setzen wir uns bei Politik und Verwaltung für bessere Rahmenbedingungen für Kunst und Kultur ein.",
    cta_text: null,
    cta_link: null,
  },
  kalender_hero: {
    title: "Veranstaltungskalender",
    subtitle: "Alle wichtigen Termine: Sitzungen, Workshops, Netzwerktreffen und Förderfristen auf einen Blick.",
    content: null,
    cta_text: null,
    cta_link: null,
  },
  foerderung_hero: {
    title: "Förderinfos",
    subtitle: "Förderprogramme, Stipendien und Ausschreibungen für Kulturschaffende – übersichtlich aufbereitet mit Fristen und Tipps.",
    content: null,
    cta_text: null,
    cta_link: null,
  },
  foerderung_tipp: {
    title: "Tipp",
    subtitle: "Brauchst du Hilfe beim Schreiben von Förderanträgen? Wir bieten kostenlose Beratung an!",
    content: null,
    cta_text: "Kontaktiere uns",
    cta_link: "/kontakt",
  },
};

export function useCMSContent(blockKey: string) {
  const [content, setContent] = useState<CMSContent>(defaultContent[blockKey] || {
    title: null,
    subtitle: null,
    content: null,
    cta_text: null,
    cta_link: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from("cms_content")
          .select("title, subtitle, content, cta_text, cta_link")
          .eq("block_key", blockKey)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setContent({
            title: data.title || defaultContent[blockKey]?.title || null,
            subtitle: data.subtitle || defaultContent[blockKey]?.subtitle || null,
            content: data.content || defaultContent[blockKey]?.content || null,
            cta_text: data.cta_text || defaultContent[blockKey]?.cta_text || null,
            cta_link: data.cta_link || defaultContent[blockKey]?.cta_link || null,
          });
        }
      } catch (error) {
        console.error("Error fetching CMS content:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, [blockKey]);

  return { content, isLoading };
}
