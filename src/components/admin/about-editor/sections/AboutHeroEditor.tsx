import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import type { AboutHero } from "../types";

interface Props { value: AboutHero; onChange: (next: AboutHero) => void; }

export function AboutHeroEditor({ value, onChange }: Props) {
  function update<K extends keyof AboutHero>(k: K, v: AboutHero[K]) { onChange({ ...value, [k]: v }); }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero</CardTitle>
        <CardDescription>Eingangsbereich der Über-uns-Seite.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Badge</Label>
            <Input value={value.badge} onChange={(e) => update("badge", e.target.value)} placeholder="Über uns" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Überschrift</Label>
          <Input value={value.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Untertitel</Label>
          <Textarea rows={3} value={value.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
        </div>
        <ImageUploadField
          label="Hintergrundbild"
          value={value.image_url}
          onChange={(url) => update("image_url", url)}
          placeholder="https://… oder hochladen"
        />
      </CardContent>
    </Card>
  );
}