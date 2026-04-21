import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IntroEditor } from "./IntroEditor";
import { SortableList } from "@/components/admin/cms/SortableList";
import { IconPicker } from "@/components/admin/cms/IconPicker";
import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import { newId } from "../useHomeEditorState";
import type { IntroData } from "../types";
import type { FeatureItem } from "@/components/home/FeaturesSection";

interface Props {
  intro: IntroData;
  items: FeatureItem[];
  onIntroChange: (next: IntroData) => void;
  onItemsChange: (next: FeatureItem[]) => void;
}

export function FeaturesEditor({ intro, items, onIntroChange, onItemsChange }: Props) {
  function updateItem(id: string, patch: Partial<FeatureItem>) {
    onItemsChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  return (
    <div className="space-y-4">
      <IntroEditor title="Was wir bieten – Intro" description="Titel, Untertitel & CTA-Button rechts." value={intro} onChange={onIntroChange} withCTA />
      <Card>
        <CardHeader>
          <CardTitle>Angebot-Karten</CardTitle>
          <CardDescription>Karten im Grid. Bild optional – sonst Standard-Bild.</CardDescription>
        </CardHeader>
        <CardContent>
          <SortableList<FeatureItem>
            items={items}
            onChange={onItemsChange}
            onAdd={() => onItemsChange([...items, { id: newId(), title: "Neuer Bereich", subtitle: "", icon: "Sparkles", link: "/", image_url: "" }])}
            addLabel="Karte hinzufügen"
            renderItem={(item) => (
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Titel</Label>
                    <Input value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Untertitel</Label>
                    <Input value={item.subtitle ?? ""} onChange={(e) => updateItem(item.id, { subtitle: e.target.value })} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Link</Label>
                      <Input value={item.link} onChange={(e) => updateItem(item.id, { link: e.target.value })} placeholder="/news" />
                    </div>
                    <IconPicker label="Icon" value={item.icon} onChange={(name) => updateItem(item.id, { icon: name })} />
                  </div>
                </div>
                <ImageUploadField
                  label="Bild (optional)"
                  folder="features"
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