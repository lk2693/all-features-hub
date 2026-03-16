import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, X, Image, Film, Plus, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

export interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface HeroMediaManagerProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

export function HeroMediaManager({ media, onChange }: HeroMediaManagerProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlType, setUrlType] = useState<"image" | "video">("image");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  function handleMove(index: number, direction: -1 | 1) {
    const newMedia = [...media];
    const target = index + direction;
    if (target < 0 || target >= newMedia.length) return;
    [newMedia[index], newMedia[target]] = [newMedia[target], newMedia[index]];
    onChange(newMedia);
  }

  return (
    <div className="space-y-4">
      <Label>Hero-Medien (Bilder & Videos)</Label>

      {/* Current media list */}
      {media.length > 0 && (
        <div className="space-y-2">
          {media.map((item, index) => (
            <Card key={index} className="p-3 flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              
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

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove(index, -1)} disabled={index === 0}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove(index, 1)} disabled={index === media.length - 1}>
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleRemove(index)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
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
