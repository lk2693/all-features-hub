import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { MitmachenCTA } from "../types";

interface Props { value: MitmachenCTA; onChange: (next: MitmachenCTA) => void; }

export function MitmachenCTAEditor({ value, onChange }: Props) {
  function update<K extends keyof MitmachenCTA>(k: K, v: MitmachenCTA[K]) { onChange({ ...value, [k]: v }); }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Call to Action</CardTitle>
        <CardDescription>Abschluss-Block am Seitenende.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Überschrift</Label>
          <Input value={value.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Beschreibung</Label>
          <Textarea rows={3} value={value.content} onChange={(e) => update("content", e.target.value)} />
        </div>
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
            <Input value={value.secondary_cta_text} onChange={(e) => update("secondary_cta_text", e.target.value)} placeholder="z.B. E-Mail-Adresse" />
          </div>
          <div className="space-y-2">
            <Label>Sekundärer Button (Link)</Label>
            <Input value={value.secondary_cta_link} onChange={(e) => update("secondary_cta_link", e.target.value)} placeholder="mailto:…" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}