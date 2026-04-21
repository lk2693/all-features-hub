import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import type { CTAData } from "../types";

interface Props {
  value: CTAData;
  onChange: (next: CTAData) => void;
}

export function CTAEditor({ value, onChange }: Props) {
  function set<K extends keyof CTAData>(k: K, v: CTAData[K]) { onChange({ ...value, [k]: v }); }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Call to Action</CardTitle>
        <CardDescription>Großer Aufruf am Ende der Startseite.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Badge-Text</Label>
            <Input value={value.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Jetzt mitmachen" />
          </div>
          <div className="space-y-2">
            <Label>Überschrift</Label>
            <Input value={value.title} onChange={(e) => set("title", e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Beschreibung</Label>
          <Textarea rows={3} value={value.content} onChange={(e) => set("content", e.target.value)} />
        </div>
        <ImageUploadField label="Hintergrundbild" folder="cta" value={value.image_url} onChange={(url) => set("image_url", url)} />
        <div className="grid gap-4 md:grid-cols-2 pt-2">
          <div className="space-y-2">
            <Label>Primärer Button – Text</Label>
            <Input value={value.primary_cta_text} onChange={(e) => set("primary_cta_text", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Primärer Button – Link</Label>
            <Input value={value.primary_cta_link} onChange={(e) => set("primary_cta_link", e.target.value)} placeholder="/mitmachen" />
          </div>
          <div className="space-y-2">
            <Label>Sekundärer Button – Text</Label>
            <Input value={value.secondary_cta_text} onChange={(e) => set("secondary_cta_text", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Sekundärer Button – Link</Label>
            <Input value={value.secondary_cta_link} onChange={(e) => set("secondary_cta_link", e.target.value)} placeholder="/kontakt" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Fußnote (kleiner Text unten)</Label>
          <Input value={value.footer_note} onChange={(e) => set("footer_note", e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
}