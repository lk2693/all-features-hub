import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HeroMediaManager, MediaItem } from "@/components/admin/HeroMediaManager";
import type { HeroData } from "../types";

interface Props {
  value: HeroData;
  onChange: (next: HeroData) => void;
}

export function HeroEditor({ value, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero-Bereich</CardTitle>
        <CardDescription>Erster Eindruck deiner Startseite mit Slideshow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Globale Überschrift (Fallback)</Label>
          <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Globaler Untertitel (Fallback)</Label>
          <Textarea rows={3} value={value.subtitle} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} />
        </div>
        <div className="pt-2">
          <Label className="mb-2 inline-block">Slides (Bilder/Videos)</Label>
          <p className="text-xs text-muted-foreground mb-3">Pro Slide kannst du Titel/Untertitel überschreiben.</p>
          <HeroMediaManager
            media={value.media as MediaItem[]}
            onChange={(media) => onChange({ ...value, media })}
          />
        </div>
      </CardContent>
    </Card>
  );
}