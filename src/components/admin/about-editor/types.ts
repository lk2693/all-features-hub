export interface AboutHero {
  badge: string;
  title: string;
  subtitle: string;
  image_url: string;
}

export interface AboutMission {
  badge: string;
  title: string;
  content: string;
  cta_text: string;
  cta_link: string;
}

export interface AboutVorstandIntro {
  badge: string;
  title: string;
  subtitle: string;
}

export interface AboutSatzungIntro {
  title: string;
  content: string;
}

export interface AboutValueItem {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

export interface AboutDocumentItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  icon: string | null;
}

export interface AboutEditorData {
  hero: AboutHero;
  mission: AboutMission;
  values: AboutValueItem[];
  vorstand_intro: AboutVorstandIntro;
  satzung: AboutSatzungIntro;
  documents: AboutDocumentItem[];
}

export type AboutSectionKey = "hero" | "mission" | "values" | "vorstand" | "satzung" | "documents";

export const aboutSectionMeta: Record<AboutSectionKey, { label: string; description: string; icon: string }> = {
  hero: { label: "Hero", description: "Eingangsbild mit Titel & Untertitel", icon: "Image" },
  mission: { label: "Mission", description: "Vereinsziel und Aufruf", icon: "Target" },
  values: { label: "Leitbild", description: "Grundwerte als Karten-Grid", icon: "Heart" },
  vorstand: { label: "Vorstand-Intro", description: "Überschrift über den Vorstandsmitgliedern", icon: "Users" },
  satzung: { label: "Satzung – Intro", description: "Beschreibung über den Downloads", icon: "FileText" },
  documents: { label: "Dokumente", description: "Satzung, Geschäftsordnung etc.", icon: "Download" },
};