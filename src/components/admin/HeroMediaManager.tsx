import { useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, X, Image, Film, Plus, GripVertical } from "lucide-react";

export interface MediaItem {
  type: "image" | "video";
  url: string;
  title?: string;
  subtitle?: string;
}

interface HeroMediaManagerProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

function SortableMediaItem({
  item,
  id,
  onRemove,
  onUpdate,
}: {
  item: MediaItem;
  id: string;
  onRemove: () => void;
  onUpdate: (patch: Partial<MediaItem>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-3 space-y-3">
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab active:cursor-grabbing touch-none shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Thumbnail */}
        <div className="w-20 h-14 rounded overflow-hidden bg-muted shrink-0">
          {item.type === "image" ? (
            <img src={item.url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Film className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {item.type === "image" ? (
              <Image className="h-3.5 w-3.5 text-primary shrink-0" />
            ) : (
              <Film className="h-3.5 w-3.5 text-accent-foreground shrink-0" />
            )}
            <span className="text-xs font-medium uppercase text-muted-foreground">
              {item.type === "image" ? "Bild" : "Video"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.url}</p>
        </div>

        {/* Remove */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
          onClick={onRemove}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Per-slide texts */}
      <div className="grid sm:grid-cols-2 gap-2 pl-7">
        <div className="space-y-1">
          <Label className="text-xs">Überschrift (optional)</Label>
          <Input
            value={item.title ?? ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Eigene Überschrift für diesen Slide"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Beschreibung (optional)</Label>
          <Input
            value={item.subtitle ?? ""}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
            placeholder="Eigener Beschreibungstext"
          />
        </div>
      </div>
    </Card>
  );
}

export function HeroMediaManager({ media, onChange }: HeroMediaManagerProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlType, setUrlType] = useState<"image" | "video">("image");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Stable IDs for sortable
  const itemIds = media.map((_, i) => `media-${i}`);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = itemIds.indexOf(active.id as string);
    const newIndex = itemIds.indexOf(over.id as string);
    onChange(arrayMove(media, oldIndex, newIndex));
  }

  async function handleFileUpload(file: File) {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isImage && !isVideo) {
      toast({ title: "Fehler", description: "Nur Bild- oder Videodateien erlaubt.", variant: "destructive" });
      return;
    }

    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({ title: "Fehler", description: `Datei zu groß (max. ${isVideo ? "50" : "5"}MB).`, variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `heroes/hero-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("cms-images").upload(path, file, { upsert: true });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from("cms-images").getPublicUrl(path);
      onChange([...media, { type: isVideo ? "video" : "image", url: publicUrl }]);
      toast({ title: "Hochgeladen", description: "Datei wurde hinzugefügt." });
    } catch (err) {
      console.error(err);
      toast({ title: "Fehler", description: "Upload fehlgeschlagen.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  }

  function handleAddUrl() {
    if (!urlInput.trim()) return;
    onChange([...media, { type: urlType, url: urlInput.trim() }]);
    setUrlInput("");
  }

  function handleRemove(index: number) {
    onChange(media.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <Label>Hero-Medien (Bilder & Videos) – per Drag & Drop sortieren</Label>

      {/* Sortable media list */}
      {media.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {media.map((item, index) => (
                <SortableMediaItem
                  key={itemIds[index]}
                  id={itemIds[index]}
                  item={item}
                  onRemove={() => handleRemove(index)}
                  onUpdate={(patch) =>
                    onChange(media.map((m, i) => (i === index ? { ...m, ...patch } : m)))
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Upload area */}
      <div
        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Wird hochgeladen...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Bild oder Video hochladen</p>
            <p className="text-xs text-muted-foreground">Bilder: PNG, JPG, WebP (max 5MB) · Videos: MP4, WebM (max 50MB)</p>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*,video/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = "";
        }}
      />

      {/* URL input */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">Oder URL einfügen:</p>
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/media..."
            onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
          />
        </div>
        <select
          value={urlType}
          onChange={(e) => setUrlType(e.target.value as "image" | "video")}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="image">Bild</option>
          <option value="video">Video</option>
        </select>
        <Button variant="outline" size="sm" onClick={handleAddUrl} disabled={!urlInput.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {media.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          Ohne Medien werden Standard-Bilder angezeigt.
        </p>
      )}
    </div>
  );
}
