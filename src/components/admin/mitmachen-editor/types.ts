export interface MitmachenHero {
  badge: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
}

export interface MitmachenIntro {
  title: string;
  subtitle: string;
}

export interface MitmachenCTA {
  title: string;
  content: string;
  cta_text: string;
  cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
}

export interface MitmachenBenefit {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

export interface MitmachenMemberType {
  id: string;
  title: string;
  price: string;
  description: string | null;
  features: string[];
  highlighted: boolean;
  cta_text: string;
  cta_link: string;
}

export interface MitmachenStep {
  id: string;
  title: string;
  description: string | null;
}

export interface MitmachenEditorData {
  hero: MitmachenHero;
  benefits_intro: MitmachenIntro;
  benefits: MitmachenBenefit[];
  member_types: MitmachenMemberType[];
  steps_intro: MitmachenIntro;
  steps: MitmachenStep[];
  ags_intro: MitmachenIntro;
  cta: MitmachenCTA;
}

export type MitmachenSectionKey =
  | "hero" | "benefits" | "member_types" | "steps" | "ags" | "cta";

export const mitmachenSectionMeta: Record<MitmachenSectionKey, { label: string; description: string; icon: string }> = {
  hero: { label: "Hero", description: "Eingangsbereich mit Buttons", icon: "Image" },
  benefits: { label: "Vorteile", description: "Mitgliedsvorteile als Karten-Grid", icon: "Sparkles" },
  member_types: { label: "Mitgliedstypen", description: "Tarif-/Kategorienkarten", icon: "Users" },
  steps: { label: "Schritte", description: "Anleitung zur Mitgliedschaft", icon: "ListOrdered" },
  ags: { label: "Arbeitsgruppen", description: "Intro über den AG-Karten (AGs werden im Startseite-Editor gepflegt)", icon: "Users" },
  cta: { label: "Call to Action", description: "Abschluss-Block am Seitenende", icon: "Megaphone" },
};