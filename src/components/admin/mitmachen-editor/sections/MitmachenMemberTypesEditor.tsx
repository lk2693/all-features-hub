import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SortableList } from "@/components/admin/cms/SortableList";
import { newId } from "../useMitmachenEditorState";
import type { MitmachenMemberType } from "../types";
import { Plus, X } from "lucide-react";

interface Props {
  items: MitmachenMemberType[];
  onChange: (next: MitmachenMemberType[]) => void;
}

export function MitmachenMemberTypesEditor({ items, onChange }: Props) {
  function updateItem(id: string, patch: Partial<MitmachenMemberType>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  function updateFeature(id: string, idx: number, value: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const features = [...item.features];
    features[idx] = value;
    updateItem(id, { features });
  }
  function addFeature(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    updateItem(id, { features: [...item.features, ""] });
  }
  function removeFeature(id: string, idx: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    updateItem(id, { features: item.features.filter((_, i) => i !== idx) });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mitgliedstypen</CardTitle>
        <CardDescription>Tarif- bzw. Kategoriekarten mit Features.</CardDescription>
      </CardHeader>
      <CardContent>
        <SortableList<MitmachenMemberType>
          items={items}
          onChange={onChange}
          onAdd={() => onChange([...items, {
            id: newId(), title: "Neuer Typ", price: "Kostenlos", description: "",
            features: [], highlighted: false, cta_text: "Jetzt beitreten", cta_link: "/kontakt",
          }])}
          addLabel="Typ hinzufügen"
          emptyLabel="Noch keine Mitgliedstypen."
          renderItem={(item) => (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-[1fr,180px,auto]">
                <div className="space-y-1">
                  <Label className="text-xs">Titel</Label>
                  <Input value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Preis</Label>
                  <Input value={item.price} onChange={(e) => updateItem(item.id, { price: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Empfohlen</Label>
                  <div className="h-9 flex items-center">
                    <Switch checked={item.highlighted} onCheckedChange={(v) => updateItem(item.id, { highlighted: v })} />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Beschreibung</Label>
                <Textarea rows={2} value={item.description ?? ""} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Features</Label>
                <div className="space-y-2">
                  {item.features.map((f, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input value={f} onChange={(e) => updateFeature(item.id, idx, e.target.value)} placeholder="z.B. Stimmrecht" />
                      <Button type="button" size="icon" variant="ghost" onClick={() => removeFeature(item.id, idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="outline" onClick={() => addFeature(item.id)}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Feature hinzufügen
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Button-Text</Label>
                  <Input value={item.cta_text} onChange={(e) => updateItem(item.id, { cta_text: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Button-Link</Label>
                  <Input value={item.cta_link} onChange={(e) => updateItem(item.id, { cta_link: e.target.value })} />
                </div>
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}