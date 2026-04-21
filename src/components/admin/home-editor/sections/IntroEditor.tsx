import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { IntroData } from "../types";

interface Props {
  title: string;
  description: string;
  value: IntroData;
  onChange: (next: IntroData) => void;
  /** When true, renders CTA button fields. */
  withCTA?: boolean;
}

export function IntroEditor({ title, description, value, onChange, withCTA }: Props) {
  function update<K extends keyof IntroData>(key: K, v: IntroData[K]) {
    onChange({ ...value, [key]: v });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Überschrift</Label>
          <Input value={value.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Untertitel / Beschreibung</Label>
          <Textarea rows={3} value={value.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
        </div>
        {withCTA && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Button-Text</Label>
              <Input value={value.cta_text ?? ""} onChange={(e) => update("cta_text", e.target.value)} placeholder="z.B. Alle Angebote" />
            </div>
            <div className="space-y-2">
              <Label>Button-Link</Label>
              <Input value={value.cta_link ?? ""} onChange={(e) => update("cta_link", e.target.value)} placeholder="/mitmachen" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}