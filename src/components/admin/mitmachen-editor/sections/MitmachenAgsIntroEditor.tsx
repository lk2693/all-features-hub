import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { MitmachenIntro } from "../types";

interface Props { value: MitmachenIntro; onChange: (next: MitmachenIntro) => void; }

export function MitmachenAgsIntroEditor({ value, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Arbeitsgruppen – Intro</CardTitle>
        <CardDescription>Überschrift über den AG-Karten. Die AGs selbst werden im Tab „Startseite" → „Arbeitsgruppen" gepflegt.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Überschrift</Label>
          <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Untertitel</Label>
          <Textarea rows={2} value={value.subtitle} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} />
        </div>
      </CardContent>
    </Card>
  );
}