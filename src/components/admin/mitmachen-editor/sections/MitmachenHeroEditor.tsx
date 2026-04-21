import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import type { MitmachenHero } from "../types";

interface Props { value: MitmachenHero; onChange: (next: MitmachenHero) => void; }

export function MitmachenHeroEditor({ value, onChange }: Props) {
  function update<K extends keyof MitmachenHero>(k: K, v: MitmachenHero[K]) { onChange({ ...value, [k]: v }); }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero</CardTitle>
        <CardDescription>Eingangsbereich mit zwei Buttons.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Badge</Label>
          <Input value={value.badge} onChange={(e) => update("badge", e.target.value)} placeholder="Mitmachen" />
        </div>
        <div className="space-y-2">
          <Label>Überschrift</Label>
          <Input value={value.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Untertitel</Label>
          <Textarea rows={3} value={value.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
        </div>
        <ImageUploadField label="Hintergrundbild" value={value.image_url} onChange={(url) => update("image_url", url)} folder="mitmachen" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Primärer Button (Text)</Label>
            <Input value={value.cta_text} onChange={(e) => update("cta_text", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Primärer Button (Link)</Label>
            <Input value={value.cta_link} onChange={(e) => update("cta_link", e.target.value)} placeholder="/kontakt" />
          </div>
          <div className="space-y-2">
            <Label>Sekundärer Button (Text)</Label>
            <Input value={value.secondary_cta_text} onChange={(e) => update("secondary_cta_text", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Sekundärer Button (Link)</Label>
            <Input value={value.secondary_cta_link} onChange={(e) => update("secondary_cta_link", e.target.value)} placeholder="#ags" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}