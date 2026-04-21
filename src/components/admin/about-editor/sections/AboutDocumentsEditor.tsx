import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SortableList } from "@/components/admin/cms/SortableList";
import { IconPicker } from "@/components/admin/cms/IconPicker";
import { newId } from "../useAboutEditorState";
import type { AboutDocumentItem } from "../types";

interface Props { items: AboutDocumentItem[]; onChange: (next: AboutDocumentItem[]) => void; }

export function AboutDocumentsEditor({ items, onChange }: Props) {
  function updateItem(id: string, patch: Partial<AboutDocumentItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dokumente</CardTitle>
        <CardDescription>Satzung, Geschäftsordnung & weitere Downloads.</CardDescription>
      </CardHeader>
      <CardContent>
        <SortableList<AboutDocumentItem>
          items={items}
          onChange={onChange}
          onAdd={() => onChange([...items, { id: newId(), title: "Neues Dokument", description: "", file_url: "#", icon: "Download" }])}
          addLabel="Dokument hinzufügen"
          emptyLabel="Noch keine Dokumente."
          renderItem={(item) => (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-[1fr,180px]">
                <div className="space-y-1">
                  <Label className="text-xs">Titel</Label>
                  <Input value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
                </div>
                <IconPicker label="Icon" value={item.icon ?? ""} onChange={(name) => updateItem(item.id, { icon: name })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Beschreibung (optional)</Label>
                <Textarea rows={2} value={item.description ?? ""} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Datei-URL</Label>
                <Input value={item.file_url} onChange={(e) => updateItem(item.id, { file_url: e.target.value })} placeholder="https://… oder /pfad/zur/datei.pdf" />
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}