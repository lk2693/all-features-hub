import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SortableList } from "@/components/admin/cms/SortableList";
import { IconPicker } from "@/components/admin/cms/IconPicker";
import { newId } from "../useMitmachenEditorState";
import type { MitmachenBenefit, MitmachenIntro } from "../types";

interface Props {
  intro: MitmachenIntro;
  items: MitmachenBenefit[];
  onIntroChange: (next: MitmachenIntro) => void;
  onItemsChange: (next: MitmachenBenefit[]) => void;
}

export function MitmachenBenefitsEditor({ intro, items, onIntroChange, onItemsChange }: Props) {
  function updateItem(id: string, patch: Partial<MitmachenBenefit>) {
    onItemsChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Vorteile – Intro</CardTitle>
          <CardDescription>Überschrift über dem Vorteile-Grid.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Überschrift</Label>
            <Input value={intro.title} onChange={(e) => onIntroChange({ ...intro, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Untertitel</Label>
            <Textarea rows={2} value={intro.subtitle} onChange={(e) => onIntroChange({ ...intro, subtitle: e.target.value })} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Vorteile</CardTitle>
          <CardDescription>Drag-and-Drop zum Sortieren.</CardDescription>
        </CardHeader>
        <CardContent>
          <SortableList<MitmachenBenefit>
            items={items}
            onChange={onItemsChange}
            onAdd={() => onItemsChange([...items, { id: newId(), title: "Neuer Vorteil", description: "", icon: "Sparkles" }])}
            addLabel="Vorteil hinzufügen"
            emptyLabel="Noch keine Vorteile."
            renderItem={(item) => (
              <div className="grid gap-3 sm:grid-cols-[1fr,1fr,180px]">
                <div className="space-y-1">
                  <Label className="text-xs">Titel</Label>
                  <Input value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Beschreibung</Label>
                  <Input value={item.description ?? ""} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
                </div>
                <IconPicker label="Icon" value={item.icon ?? ""} onChange={(name) => updateItem(item.id, { icon: name })} />
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}