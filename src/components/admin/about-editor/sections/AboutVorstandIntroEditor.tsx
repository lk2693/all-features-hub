import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { AboutVorstandIntro } from "../types";

interface Props { value: AboutVorstandIntro; onChange: (next: AboutVorstandIntro) => void; }

export function AboutVorstandIntroEditor({ value, onChange }: Props) {
  function update<K extends keyof AboutVorstandIntro>(k: K, v: AboutVorstandIntro[K]) { onChange({ ...value, [k]: v }); }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vorstand – Intro</CardTitle>
        <CardDescription>Überschrift über den Vorstandsmitgliedern. Mitglieder selbst werden im Tab „Vorstand" verwaltet.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Badge</Label>
          <Input value={value.badge} onChange={(e) => update("badge", e.target.value)} placeholder="Team" />
        </div>
        <div className="space-y-2">
          <Label>Überschrift</Label>
          <Input value={value.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Untertitel</Label>
          <Textarea rows={2} value={value.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
}