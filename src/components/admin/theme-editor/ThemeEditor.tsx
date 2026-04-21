import { useEffect, useState } from "react";
import { Loader2, Save, RotateCcw, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { applyTheme, type ThemeSettings } from "@/hooks/useTheme";

const DEFAULTS: ThemeSettings = {
  primary_color: "12 76% 55%",
  primary_foreground: "0 0% 100%",
  primary_glow: "25 85% 60%",
  accent: "42 95% 55%",
  accent_foreground: "220 25% 15%",
  background: "40 30% 98%",
  foreground: "220 25% 18%",
  card: "0 0% 100%",
  card_foreground: "220 25% 18%",
  muted: "40 20% 94%",
  muted_foreground: "220 15% 45%",
  border: "40 20% 88%",
  secondary: "150 25% 92%",
  secondary_foreground: "150 35% 25%",
  font_display: "Playfair Display",
  font_body: "Inter",
};

const FONTS = ["Inter", "Playfair Display", "Roboto", "Poppins", "Montserrat", "Lora", "Merriweather", "Open Sans", "Source Sans 3", "Raleway", "Work Sans", "DM Sans", "DM Serif Display", "Space Grotesk"];

type Group = { label: string; description: string; fields: Array<{ key: keyof ThemeSettings; label: string }> };

const GROUPS: Group[] = [
  {
    label: "Brand-Farben",
    description: "Primär- und Akzent-Farben für Buttons, Links, Highlights",
    fields: [
      { key: "primary_color", label: "Primär" },
      { key: "primary_foreground", label: "Primär-Text (auf Primär)" },
      { key: "primary_glow", label: "Primär-Glow (Verläufe)" },
      { key: "accent", label: "Akzent" },
      { key: "accent_foreground", label: "Akzent-Text" },
    ],
  },
  {
    label: "Flächen",
    description: "Hintergründe für Seite, Karten und gedämpfte Bereiche",
    fields: [
      { key: "background", label: "Seiten-Hintergrund" },
      { key: "card", label: "Karten-Hintergrund" },
      { key: "card_foreground", label: "Karten-Text" },
      { key: "muted", label: "Gedämpft (Sektionen)" },
      { key: "border", label: "Rahmen" },
      { key: "secondary", label: "Sekundär" },
      { key: "secondary_foreground", label: "Sekundär-Text" },
    ],
  },
  {
    label: "Schrift-Farben",
    description: "Text-Farben für Überschriften und Fließtext",
    fields: [
      { key: "foreground", label: "Haupt-Text" },
      { key: "muted_foreground", label: "Gedämpfter Text" },
    ],
  },
];

// Convert "H S% L%" string ↔ hex for color picker.
function hslToHex(hsl: string): string {
  const m = hsl.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (!m) return "#000000";
  const h = parseFloat(m[1]) / 360, s = parseFloat(m[2]) / 100, l = parseFloat(m[3]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function hexToHsl(hex: string): string {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return "0 0% 0%";
  const [r, g, b] = m.map((x) => parseInt(x, 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function ThemeEditor() {
  const { toast } = useToast();
  const [data, setData] = useState<ThemeSettings>(DEFAULTS);
  const [original, setOriginal] = useState<ThemeSettings>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase.from("theme_settings").select("*").eq("id", "default").maybeSingle().then(({ data: row }) => {
      if (row) {
        const merged = { ...DEFAULTS, ...(row as Partial<ThemeSettings>) };
        setData(merged);
        setOriginal(merged);
      }
      setIsLoading(false);
    });
  }, []);

  const hasChanges = JSON.stringify(data) !== JSON.stringify(original);

  function update<K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) {
    const next = { ...data, [key]: value };
    setData(next);
    applyTheme(next); // live preview
  }

  async function save() {
    setIsSaving(true);
    const { error } = await supabase.from("theme_settings").update({ ...data, id: "default" }).eq("id", "default");
    setIsSaving(false);
    if (error) {
      toast({ title: "Fehler beim Speichern", description: error.message, variant: "destructive" });
    } else {
      setOriginal(data);
      toast({ title: "Design gespeichert", description: "Änderungen sind sofort live." });
    }
  }

  function reset() {
    setData(original);
    applyTheme(original);
  }

  function resetToDefaults() {
    setData(DEFAULTS);
    applyTheme(DEFAULTS);
  }

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2"><Palette className="h-5 w-5" /> Design & Farben</h3>
          <p className="text-sm text-muted-foreground">Globale Farben und Schriften für die gesamte Website. Änderungen sind sofort als Vorschau sichtbar.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={resetToDefaults} disabled={isSaving}>Standard wiederherstellen</Button>
          <Button variant="outline" onClick={reset} disabled={!hasChanges || isSaving}>
            <RotateCcw className="h-4 w-4 mr-2" /> Verwerfen
          </Button>
          <Button onClick={save} disabled={!hasChanges || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Speichern
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-2 text-sm text-warning">
          Ungespeicherte Änderungen — die Vorschau wird live angezeigt, aber erst nach „Speichern" für alle Besucher sichtbar.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Typografie</CardTitle>
          <CardDescription>Schriftarten für Überschriften und Fließtext (Google Fonts)</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Display-Font (Überschriften)</Label>
            <Select value={data.font_display} onValueChange={(v) => update("font_display", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-2xl mt-2" style={{ fontFamily: data.font_display }}>Aa Bb Cc 123</p>
          </div>
          <div className="space-y-2">
            <Label>Body-Font (Fließtext)</Label>
            <Select value={data.font_body} onValueChange={(v) => update("font_body", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-base mt-2" style={{ fontFamily: data.font_body }}>The quick brown fox jumps over the lazy dog.</p>
          </div>
        </CardContent>
      </Card>

      {GROUPS.map((g) => (
        <Card key={g.label}>
          <CardHeader>
            <CardTitle>{g.label}</CardTitle>
            <CardDescription>{g.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            {g.fields.map((f) => {
              const val = data[f.key] as string;
              const hex = hslToHex(val);
              return (
                <div key={f.key} className="space-y-2">
                  <Label>{f.label}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={hex}
                      onChange={(e) => update(f.key, hexToHsl(e.target.value) as ThemeSettings[typeof f.key])}
                      className="h-10 w-14 rounded border cursor-pointer bg-transparent"
                      aria-label={f.label}
                    />
                    <Input
                      value={val}
                      onChange={(e) => update(f.key, e.target.value as ThemeSettings[typeof f.key])}
                      placeholder="H S% L%"
                      className="font-mono text-xs"
                    />
                    <div
                      className="h-10 w-10 rounded border shrink-0"
                      style={{ background: `hsl(${val})` }}
                      title={`hsl(${val})`}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader><CardTitle>Live-Vorschau</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button>Primär-Button</Button>
            <Button variant="secondary">Sekundär</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-display text-lg font-bold text-foreground">Beispiel-Karte</h4>
            <p className="text-sm text-muted-foreground mt-1">So sehen deine Inhalte mit den gewählten Farben aus.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}