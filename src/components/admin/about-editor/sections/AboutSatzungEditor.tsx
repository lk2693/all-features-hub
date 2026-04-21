import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { AboutSatzungIntro } from "../types";

interface Props { value: AboutSatzungIntro; onChange: (next: AboutSatzungIntro) => void; }

export function AboutSatzungEditor({ value, onChange }: Props) {
  function update<K extends keyof AboutSatzungIntro>(k: K, v: AboutSatzungIntro[K]) { onChange({ ...value, [k]: v }); }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Satzung – Intro</CardTitle>
        <CardDescription>Beschreibungstext über den Download-Buttons.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Überschrift</Label>
          <Input value={value.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Beschreibung</Label>
          <Textarea rows={4} value={value.content} onChange={(e) => update("content", e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
}