import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const TOKEN_MAP: Record<string, string> = {
  primary_color: "--primary",
  primary_foreground: "--primary-foreground",
  primary_glow: "--primary-glow",
  accent: "--accent",
  accent_foreground: "--accent-foreground",
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  card_foreground: "--card-foreground",
  muted: "--muted",
  muted_foreground: "--muted-foreground",
  border: "--border",
  secondary: "--secondary",
  secondary_foreground: "--secondary-foreground",
};

export interface ThemeSettings {
  primary_color: string;
  primary_foreground: string;
  primary_glow: string;
  accent: string;
  accent_foreground: string;
  background: string;
  foreground: string;
  card: string;
  card_foreground: string;
  muted: string;
  muted_foreground: string;
  border: string;
  secondary: string;
  secondary_foreground: string;
  font_display: string;
  font_body: string;
}

export function applyTheme(t: Partial<ThemeSettings>) {
  const root = document.documentElement;
  for (const [col, cssVar] of Object.entries(TOKEN_MAP)) {
    const val = (t as Record<string, string | undefined>)[col];
    if (val) root.style.setProperty(cssVar, val);
  }
  if (t.font_display) root.style.setProperty("--font-display", `"${t.font_display}", serif`);
  if (t.font_body) root.style.setProperty("--font-body", `"${t.font_body}", sans-serif`);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    supabase.from("theme_settings").select("*").eq("id", "default").maybeSingle().then(({ data }) => {
      if (!cancelled && data) applyTheme(data as ThemeSettings);
    });
    const channel = supabase
      .channel("theme-settings")
      .on("postgres_changes", { event: "*", schema: "public", table: "theme_settings" }, (payload) => {
        if (payload.new) applyTheme(payload.new as ThemeSettings);
      })
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);
  return <>{children}</>;
}