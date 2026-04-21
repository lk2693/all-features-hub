import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IntroEditor } from "./IntroEditor";
import { SortableList } from "@/components/admin/cms/SortableList";
import { IconPicker } from "@/components/admin/cms/IconPicker";
import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import { newId } from "../useHomeEditorState";
import type { IntroData } from "../types";
import type { WorkingGroupItem } from "@/components/home/WorkingGroupsSection";

interface Props {
  intro: IntroData;
  items: WorkingGroupItem[];
  onIntroChange: (next: IntroData) => void;
  onItemsChange: (next: WorkingGroupItem[]) => void;
}

export function WorkingGroupsEditor({ intro, items, onIntroChange, onItemsChange }: Props) {
  function updateItem(id: string, patch: Partial<WorkingGroupItem>) {
    onItemsChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  return (
    <div className="space-y-4">
      <IntroEditor title="Arbeitsgruppen – Intro" description="Titel, Untertitel & CTA." value={intro} onChange={onIntroChange} withCTA />
      <Card>
        <CardHeader>
          <CardTitle>AGs</CardTitle>
          <CardDescription>Karten mit Bild, Icon, Mitgliederzahl.</CardDescription>
        </CardHeader>
        <CardContent>
          <SortableList<WorkingGroupItem>
            items={items}
            onChange={onItemsChange}
            onAdd={() => onItemsChange([...items, { id: newId(), name: "Neue AG", description: "", icon: "Users", image_url: "", member_count: 0 }])}
            addLabel="AG hinzufügen"
            renderItem={(item) => (
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Name</Label>
                    <Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Beschreibung</Label>
                    <Textarea rows={2} value={item.description ?? ""} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Mitglieder</Label>
                      <Input type="number" value={item.member_count ?? 0} onChange={(e) => updateItem(item.id, { member_count: Number(e.target.value) })} />
                    </div>
                    <IconPicker label="Icon" value={item.icon} onChange={(name) => updateItem(item.id, { icon: name })} />
                  </div>
                </div>
                <ImageUploadField
                  label="Bild"
                  folder="working-groups"
                  value={item.image_url ?? ""}
                  onChange={(url) => updateItem(item.id, { image_url: url })}
                />
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}