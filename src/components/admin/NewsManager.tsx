import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";

interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  is_published: boolean;
}

const defaultFormData: NewsFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  is_published: false,
};

export function NewsManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [formData, setFormData] = useState<NewsFormData>(defaultFormData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<NewsPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Fehler",
        description: "News konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[äöüß]/g, (match) => {
        const map: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };
        return map[match] || match;
      })
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleTitleChange(title: string) {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingPost ? prev.slug : generateSlug(title),
    }));
  }

  function openCreateDialog() {
    setEditingPost(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
  }

  function openEditDialog(post: NewsPost) {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      cover_image_url: post.cover_image_url || "",
      is_published: post.is_published,
    });
    setIsDialogOpen(true);
  }

  async function handleSave() {
    if (!formData.title || !formData.slug || !formData.content) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content,
        cover_image_url: formData.cover_image_url || null,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
        author_id: user?.id,
        author_name: user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Admin",
      };

      if (editingPost) {
        const { error } = await supabase
          .from("news_posts")
          .update(postData)
          .eq("id", editingPost.id);

        if (error) throw error;
        
        setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...postData } : p));
        toast({ title: "Gespeichert", description: "News wurde aktualisiert." });
      } else {
        const { data, error } = await supabase
          .from("news_posts")
          .insert(postData)
          .select()
          .single();

        if (error) throw error;
        
        setPosts(prev => [data, ...prev]);
        toast({ title: "Erstellt", description: "News wurde erstellt." });
      }

      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast({
        title: "Fehler",
        description: error.message?.includes("duplicate") 
          ? "Ein Beitrag mit diesem Slug existiert bereits." 
          : "Speichern fehlgeschlagen.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("news_posts")
        .delete()
        .eq("id", postToDelete.id);

      if (error) throw error;

      setPosts(prev => prev.filter(p => p.id !== postToDelete.id));
      toast({ title: "Gelöscht", description: "News wurde gelöscht." });
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Fehler",
        description: "Löschen fehlgeschlagen.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const publishedPosts = posts.filter(p => p.is_published);
  const draftPosts = posts.filter(p => !p.is_published);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">News verwalten</h2>
          <p className="text-muted-foreground">Erstellen und bearbeiten Sie News-Beiträge</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Neuer Beitrag
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Entwürfe</CardDescription>
            <CardTitle className="text-3xl text-amber-600">{draftPosts.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Veröffentlicht</CardDescription>
            <CardTitle className="text-3xl text-primary">{publishedPosts.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Gesamt</CardDescription>
            <CardTitle className="text-3xl">{posts.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Beiträge</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Noch keine News vorhanden.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Erstellt</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {post.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.is_published ? "default" : "secondary"}>
                        {post.is_published ? "Veröffentlicht" : "Entwurf"}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.author_name}</TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/news/${post.slug}`, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setPostToDelete(post);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Beitrag bearbeiten" : "Neuer Beitrag"}
            </DialogTitle>
            <DialogDescription>
              {editingPost ? "Bearbeiten Sie den News-Beitrag" : "Erstellen Sie einen neuen News-Beitrag"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Titel des Beitrags"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL-Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="url-slug"
              />
              <p className="text-xs text-muted-foreground">
                Wird für die URL verwendet: /news/{formData.slug || "slug"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Kurzfassung</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Kurze Zusammenfassung für die Übersicht"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Inhalt *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Der vollständige Inhalt des Beitrags..."
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image_url">Cover-Bild URL</Label>
              <Input
                id="cover_image_url"
                value={formData.cover_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Veröffentlichen</Label>
                <p className="text-sm text-muted-foreground">
                  Beitrag ist öffentlich sichtbar
                </p>
              </div>
              <Switch
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingPost ? "Speichern" : "Erstellen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Beitrag löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie "{postToDelete?.title}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
