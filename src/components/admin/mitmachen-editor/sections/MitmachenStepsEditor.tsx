import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SortableList } from "@/components/admin/cms/SortableList";
import { newId } from "../useMitmachenEditorState";
import type { MitmachenIntro, MitmachenStep } from "../types";

interface Props {
  intro: MitmachenIntro;
  items: MitmachenStep[];
  onIntroChange: (next: MitmachenIntro) => void;
  onItemsChange: (next: MitmachenStep[]) => void;
}

export function MitmachenStepsEditor({ intro, items, onIntroChange, onItemsChange }: Props) {
  function updateItem(id: string, patch: Partial<MitmachenStep>) {
    onItemsChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Schritte – Intro</CardTitle>
          <CardDescription>Überschrift über den Schritten.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Überschrift</Label>
            <Input value={intro.title} onChange={(e) => onIntroChange({ ...intro, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Untertitel</Label>
            <Input value={intro.subtitle} onChange={(e) => onIntroChange({ ...intro, subtitle: e.target.value })} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Schritte</CardTitle>
          <CardDescription>Reihenfolge bestimmt die Nummerierung (1, 2, 3 …).</CardDescription>
        </CardHeader>
        <CardContent>
          <SortableList<MitmachenStep>
            items={items}
            onChange={onItemsChange}
            onAdd={() => onItemsChange([...items, { id: newId(), title: "Neuer Schritt", description: "" }])}
            addLabel="Schritt hinzufügen"
            emptyLabel="Noch keine Schritte."
            renderItem={(item) => (
              <div className="grid gap-3 sm:grid-cols-[1fr,2fr]">
                <div className="space-y-1">
                  <Label className="text-xs">Titel</Label>
                  <Input value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Beschreibung</Label>
                  <Textarea rows={2} value={item.description ?? ""} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}