import * as Lucide from "lucide-react";
import { LucideIcon, HelpCircle } from "lucide-react";

/**
 * Look up a Lucide icon by its component name (e.g. "Newspaper", "Users").
 * Falls back to HelpCircle if not found.
 */
export function getIcon(name?: string | null): LucideIcon {
  if (!name) return HelpCircle;
  const Icon = (Lucide as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? HelpCircle;
}

/** Curated list of icons available for the home CMS pickers. */
export const HOME_ICONS = [
  "Newspaper", "CalendarDays", "Calendar", "Package", "Coins", "Users", "MessageSquare",
  "Folder", "Target", "FileCheck", "Megaphone", "Palette", "Vote", "BookOpen",
  "Handshake", "Mail", "Heart", "Star", "Sparkles", "Lightbulb", "Music", "Camera",
  "Wrench", "Monitor", "Home", "Globe", "Award", "TrendingUp", "Zap", "Shield",
] as const;
