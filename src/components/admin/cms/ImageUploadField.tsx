import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  /** Folder prefix inside the cms-images bucket */
  folder?: string;
  /** Max file size in MB. Defaults to 5. */
  maxSizeMB?: number;
  /** Accept attr. Defaults to image/*. */
  accept?: string;
  helpText?: string;
}

/**
 * Reusable image upload field for CMS editors.
 * Uploads to the public `cms-images` bucket and returns the public URL.
 */
export function ImageUploadField({
  label = "Bild",
  value,
  onChange,
  folder = "general",
  maxSizeMB = 5,
  accept = "image/*",
  helpText,
}: ImageUploadFieldProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Fehler", description: "Bitte wähle eine Bilddatei.", variant: "destructive" });
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({ title: "Fehler", description: `Das Bild darf maximal ${maxSizeMB}MB groß sein.`, variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("cms-images").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("cms-images").getPublicUrl(path);
      onChange(publicUrl);
      toast({ title: "Hochgeladen", description: "Bild wurde erfolgreich hochgeladen." });
    } catch (err) {
      console.error("Upload error", err);
      toast({ title: "Fehler", description: "Upload fehlgeschlagen.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-border group">
          <img src={value} alt="Preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()} disabled={isUploading}>
              <Upload className="h-4 w-4 mr-1" /> Ersetzen
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={() => onChange("")}>
              <X className="h-4 w-4 mr-1" /> Entfernen
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Wird hochgeladen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Bild hochladen</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP bis {maxSizeMB}MB</p>
            </div>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="oder Bild-URL einfügen…"
      />

      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
}