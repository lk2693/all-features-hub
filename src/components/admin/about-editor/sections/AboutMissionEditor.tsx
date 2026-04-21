import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { AboutMission } from "../types";

interface Props { value: AboutMission; onChange: (next: AboutMission) => void; }

export function AboutMissionEditor({ value, onChange }: Props) {
  function update<K extends keyof AboutMission>(k: K, v: AboutMission[K]) { onChange({ ...value, [k]: v }); }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mission</CardTitle>
        <CardDescription>Vereinsziel mit Aufruf zur Mitgliedschaft.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Badge</Label>
          <Input value={value.badge} onChange={(e) => update("badge", e.target.value)} placeholder="Mission" />
        </div>
        <div className="space-y-2">
          <Label>Überschrift</Label>
          <Input value={value.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Beschreibung</Label>
          <Textarea rows={6} value={value.content} onChange={(e) => update("content", e.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Button-Text</Label>
            <Input value={value.cta_text} onChange={(e) => update("cta_text", e.target.value)} placeholder="Mitglied werden" />
          </div>
          <div className="space-y-2">
            <Label>Button-Link</Label>
            <Input value={value.cta_link} onChange={(e) => update("cta_link", e.target.value)} placeholder="/mitmachen" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}