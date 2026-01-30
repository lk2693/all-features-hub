import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface BestPractice {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  cover_image_url: string | null;
  author_name: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

const categories = [
  { value: "allgemein", label: "Allgemein" },
  { value: "foerderung", label: "Förderung" },
  { value: "veranstaltung", label: "Veranstaltungen" },
  { value: "kommunikation", label: "Kommunikation" },
  { value: "organisation", label: "Organisation" },
  { value: "recht", label: "Recht & Finanzen" },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BestPracticesManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPractice, setEditingPractice] = useState<BestPractice | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("allgemein");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [authorName, setAuthorName] = useState("");

  const { data: practices = [], isLoading } = useQuery({
    queryKey: ["admin-best-practices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("best_practices")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BestPractice[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (isNew: boolean) => {
      const practiceData = {
        title,
        slug: slug || generateSlug(title),
        excerpt: excerpt || null,
        content,
        category,
        cover_image_url: coverImageUrl || null,
        author_name: authorName,
        author_id: user?.id,
      };

      if (isNew) {
        const { error } = await supabase.from("best_practices").insert(practiceData);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("best_practices")
          .update(practiceData)
          .eq("id", editingPractice!.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-best-practices"] });
      toast({ title: "Gespeichert", description: "Der Leitfaden wurde erfolgreich gespeichert." });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: "Fehler", description: "Speichern fehlgeschlagen.", variant: "destructive" });
      console.error("Save error:", error);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from("best_practices")
        .update({
          is_published: !isPublished,
          published_at: !isPublished ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-best-practices"] });
      toast({ title: "Status geändert" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("best_practices").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-best-practices"] });
      toast({ title: "Gelöscht", description: "Der Leitfaden wurde gelöscht." });
    },
  });

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("allgemein");
    setCoverImageUrl("");
    setAuthorName("");
    setEditingPractice(null);
  };

  const handleEdit = (practice: BestPractice) => {
    setEditingPractice(practice);
    setTitle(practice.title);
    setSlug(practice.slug);
    setExcerpt(practice.excerpt || "");
    setContent(practice.content);
    setCategory(practice.category);
    setCoverImageUrl(practice.cover_image_url || "");
    setAuthorName(practice.author_name);
    setIsDialogOpen(true);
  };

  const handleNewPractice = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Best Practices verwalten</h2>
          <p className="text-sm text-muted-foreground">
            Erstellen und bearbeiten Sie Leitfäden für Kulturschaffende.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewPractice} className="gap-2">
              <Plus className="h-4 w-4" />
              Neuer Leitfaden
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPractice ? "Leitfaden bearbeiten" : "Neuer Leitfaden"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate(!editingPractice);
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingPractice) setSlug(generateSlug(e.target.value));
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL-Slug *</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorie</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="z.B. Max Mustermann"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Kurzbeschreibung</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Kurze Zusammenfassung des Leitfadens..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Inhalt *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Der vollständige Inhalt des Leitfadens..."
                  rows={10}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverImage">Titelbild-URL</Label>
                <Input
                  id="coverImage"
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Abbrechen
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Speichern
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : practices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Noch keine Leitfäden vorhanden.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {practices.map((practice) => (
            <Card key={practice.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <GripVertical className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium truncate">{practice.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {categories.find((c) => c.value === practice.category)?.label}
                      </Badge>
                      {practice.is_published ? (
                        <Badge className="bg-primary/10 text-primary text-xs">
                          Veröffentlicht
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Entwurf
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      /best-practices/{practice.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      togglePublishMutation.mutate({
                        id: practice.id,
                        isPublished: practice.is_published,
                      })
                    }
                    title={practice.is_published ? "Depublizieren" : "Veröffentlichen"}
                  >
                    {practice.is_published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(practice)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Leitfaden löschen?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Möchten Sie "{practice.title}" wirklich löschen? Diese Aktion kann nicht
                          rückgängig gemacht werden.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(practice.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Löschen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
