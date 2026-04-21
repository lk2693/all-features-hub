import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SortableList } from "@/components/admin/cms/SortableList";
import { IconPicker } from "@/components/admin/cms/IconPicker";
import { ImageUploadField } from "@/components/admin/cms/ImageUploadField";
import { newId } from "../useHomeEditorState";
import type { MembershipData } from "../types";
import type { BenefitItem } from "@/components/home/MembershipSection";

type BenefitWithId = BenefitItem & { id: string };

interface Props {
  value: MembershipData;
  onChange: (next: MembershipData) => void;
}

export function MembershipEditor({ value, onChange }: Props) {
  // Ensure benefits have IDs (sortable needs stable id).
  const benefitsWithId: BenefitWithId[] = value.benefits.map((b, i) => ({
    ...b,
    id: (b as BenefitWithId).id ?? `benefit-${i}`,
  }));

  function setBenefits(next: BenefitWithId[]) {
    onChange({ ...value, benefits: next });
  }
  function updateBenefit(id: string, patch: Partial<BenefitItem>) {
    setBenefits(benefitsWithId.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Mitgliedschaft – Texte & Bild</CardTitle>
          <CardDescription>Titel, Untertitel und Zitat-Bereich am Ende.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Überschrift</Label>
              <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Zitat-Autor</Label>
              <Input value={value.quote_author} onChange={(e) => onChange({ ...value, quote_author: e.target.value })} placeholder="— Kulturrat Braunschweig e.V." />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Untertitel</Label>
            <Textarea rows={2} value={value.subtitle} onChange={(e) => onChange({ ...value, subtitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Zitat</Label>
            <Textarea rows={2} value={value.content} onChange={(e) => onChange({ ...value, content: e.target.value })} />
          </div>
          <ImageUploadField
            label="Hintergrundbild für Zitat-Block"
            folder="membership"
            value={value.image_url}
            onChange={(url) => onChange({ ...value, image_url: url })}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Vorteile</CardTitle>
          <CardDescription>Karten-Grid mit Icon, Titel, Beschreibung.</CardDescription>
        </CardHeader>
        <CardContent>
          <SortableList<BenefitWithId>
            items={benefitsWithId}
            onChange={setBenefits}
            onAdd={() => setBenefits([...benefitsWithId, { id: newId("benefit"), icon: "Sparkles", title: "Neuer Vorteil", desc: "" }])}
            addLabel="Vorteil hinzufügen"
            renderItem={(item) => (
              <div className="grid gap-3 sm:grid-cols-[160px,1fr,1fr]">
                <IconPicker label="Icon" value={item.icon} onChange={(name) => updateBenefit(item.id, { icon: name })} />
                <div className="space-y-1">
                  <Label className="text-xs">Titel</Label>
                  <Input value={item.title} onChange={(e) => updateBenefit(item.id, { title: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Beschreibung</Label>
                  <Input value={item.desc ?? ""} onChange={(e) => updateBenefit(item.id, { desc: e.target.value })} />
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}