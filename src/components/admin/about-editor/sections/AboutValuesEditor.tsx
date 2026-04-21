import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SortableList } from "@/components/admin/cms/SortableList";
import { IconPicker } from "@/components/admin/cms/IconPicker";
import { newId } from "../useAboutEditorState";
import type { AboutValueItem } from "../types";

interface Props { items: AboutValueItem[]; onChange: (next: AboutValueItem[]) => void; }

export function AboutValuesEditor({ items, onChange }: Props) {
  function updateItem(id: string, patch: Partial<AboutValueItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leitbild-Werte</CardTitle>
        <CardDescription>Drag-and-Drop zum Sortieren. Erscheinen als Karten neben der Mission.</CardDescription>
      </CardHeader>
      <CardContent>
        <SortableList<AboutValueItem>
          items={items}
          onChange={onChange}
          onAdd={() => onChange([...items, { id: newId(), title: "Neuer Wert", description: "", icon: "Sparkles" }])}
          addLabel="Wert hinzufügen"
          emptyLabel="Noch keine Werte."
          renderItem={(item) => (
            <div className="grid gap-3 sm:grid-cols-[1fr,1fr,180px]">
              <div className="space-y-1">
                <Label className="text-xs">Titel</Label>
                <Input value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Beschreibung</Label>
                <Textarea rows={2} value={item.description ?? ""} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
              </div>
              <IconPicker label="Icon" value={item.icon ?? ""} onChange={(name) => updateItem(item.id, { icon: name })} />
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}