import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IntroEditor } from "./IntroEditor";
import { SortableList } from "@/components/admin/cms/SortableList";
import { IconPicker } from "@/components/admin/cms/IconPicker";
import { newId } from "../useHomeEditorState";
import type { IntroData } from "../types";
import type { StatItem } from "@/components/home/StatsCounter";

interface Props {
  intro: IntroData;
  items: StatItem[];
  onIntroChange: (next: IntroData) => void;
  onItemsChange: (next: StatItem[]) => void;
}

export function StatsEditor({ intro, items, onIntroChange, onItemsChange }: Props) {
  function updateItem(id: string, patch: Partial<StatItem>) {
    onItemsChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  return (
    <div className="space-y-4">
      <IntroEditor
        title="Statistiken – Intro"
        description="Optionaler Titel & Untertitel über den Zahlen."
        value={intro}
        onChange={onIntroChange}
      />
      <Card>
        <CardHeader>
          <CardTitle>Statistik-Werte</CardTitle>
          <CardDescription>Drag-and-Drop zum Sortieren. Werte werden hochgezählt.</CardDescription>
        </CardHeader>
        <CardContent>
          <SortableList<StatItem>
            items={items}
            onChange={onItemsChange}
            onAdd={() => onItemsChange([...items, { id: newId(), label: "Neu", value: 0, suffix: "+", icon: "Sparkles" }])}
            addLabel="Statistik hinzufügen"
            emptyLabel="Noch keine Statistiken."
            renderItem={(item) => (
              <div className="grid gap-3 sm:grid-cols-[1fr,80px,80px,160px]">
                <div className="space-y-1">
                  <Label className="text-xs">Label</Label>
                  <Input value={item.label} onChange={(e) => updateItem(item.id, { label: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Wert</Label>
                  <Input type="number" value={Number(item.value)} onChange={(e) => updateItem(item.id, { value: Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Suffix</Label>
                  <Input value={item.suffix ?? ""} onChange={(e) => updateItem(item.id, { suffix: e.target.value })} placeholder="+" />
                </div>
                <IconPicker label="Icon" value={item.icon} onChange={(name) => updateItem(item.id, { icon: name })} />
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}