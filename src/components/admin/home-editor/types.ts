import type { StatItem } from "@/components/home/StatsCounter";
import type { FeatureItem } from "@/components/home/FeaturesSection";
import type { WorkingGroupItem } from "@/components/home/WorkingGroupsSection";
import type { BenefitItem } from "@/components/home/MembershipSection";

/** Hero media item (mirrors HeroMediaManager.MediaItem). */
export interface HeroMediaItem {
  type: "image" | "video";
  url: string;
  title?: string;
  subtitle?: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  media: HeroMediaItem[];
}

export interface IntroData {
  title: string;
  subtitle: string;
  cta_text?: string;
  cta_link?: string;
}

export interface MembershipData {
  title: string;
  subtitle: string;
  content: string; // quote
  image_url: string;
  quote_author: string;
  benefits: BenefitItem[];
}

export interface CTAData {
  title: string;
  subtitle: string; // badge
  content: string;  // body
  image_url: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  footer_note: string;
}

export interface HomeEditorData {
  hero: HeroData;
  stats_intro: IntroData;
  stats: StatItem[];
  features_intro: IntroData;
  features: FeatureItem[];
  news_intro: IntroData;
  working_groups_intro: IntroData;
  working_groups: WorkingGroupItem[];
  calendar_intro: IntroData;
  resources_intro: IntroData;
  membership: MembershipData;
  cta: CTAData;
}

export type SectionKey =
  | "hero"
  | "stats"
  | "features"
  | "news"
  | "working_groups"
  | "calendar"
  | "resources"
  | "membership"
  | "cta";

export const sectionMeta: Record<SectionKey, { label: string; description: string; icon: string }> = {
  hero: { label: "Hero", description: "Großes Eingangsbild mit Titel & Slides", icon: "Image" },
  stats: { label: "Statistiken", description: "Zahlen & Kennwerte", icon: "BarChart3" },
  features: { label: "Was wir bieten", description: "Karten-Grid mit Angeboten", icon: "LayoutGrid" },
  news: { label: "News-Vorschau", description: "Intro für aktuelle Beiträge", icon: "Newspaper" },
  working_groups: { label: "Arbeitsgruppen", description: "AGs-Karten mit Intro", icon: "Users" },
  calendar: { label: "Kalender-Vorschau", description: "Intro über Termine", icon: "Calendar" },
  resources: { label: "Ressourcen-Vorschau", description: "Intro zum Ressourcenpool", icon: "Package" },
  membership: { label: "Mitgliedschaft", description: "Vorteile, Tarife & Zitat", icon: "Heart" },
  cta: { label: "Call to Action", description: "Abschluss-Aufruf am Seitenende", icon: "Megaphone" },
};