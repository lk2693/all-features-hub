import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Loader2, Upload, X, GripVertical, User } from "lucide-react";

interface VorstandMember {
  id: string;
  name: string;
  role: string;
  bereich: string;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VorstandFormData {
  name: string;
  role: string;
  bereich: string;
  bio: string;
  image_url: string;
  email: string;
  is_active: boolean;
}

const defaultFormData: VorstandFormData = {
  name: "",
  role: "",
  bereich: "",
  bio: "",
  image_url: "",
  email: "",
  is_active: true,
};

export function VorstandManager() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [members, setMembers] = useState<VorstandMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingMember, setEditingMember] = useState<VorstandMember | null>(null);
  const [formData, setFormData] = useState<VorstandFormData>(defaultFormData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<VorstandMember | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      const { data, error } = await supabase
        .from("vorstand_members")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setMembers((data || []) as unknown as VorstandMember[]);
    } catch (error) {
      console.error("Error fetching vorstand members:", error);
      toast({
        title: "Fehler",
        description: "Vorstandsmitglieder konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingMember(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
  }

  function openEditDialog(member: VorstandMember) {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bereich: member.bereich,
      bio: member.bio || "",
      image_url: member.image_url || "",
      email: member.email || "",
      is_active: member.is_active,
    });
    setIsDialogOpen(true);
  }

  function openDeleteDialog(member: VorstandMember) {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  }

  async function handleImageUpload(file: File) {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Fehler",
        description: "Bitte wähle eine Bilddatei aus.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fehler",
        description: "Das Bild darf maximal 5MB groß sein.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `vorstand-${Date.now()}.${fileExt}`;
      const filePath = `vorstand/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cms-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));

      toast({
        title: "Hochgeladen",
        description: "Das Bild wurde erfolgreich hochgeladen.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Fehler",
        description: "Bild konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  function removeImage() {
    setFormData(prev => ({ ...prev, image_url: "" }));
  }

  async function handleSave() {
    if (!formData.name || !formData.role || !formData.bereich) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Pflichtfelder aus.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const memberData = {
        name: formData.name,
        role: formData.role,
        bereich: formData.bereich,
        bio: formData.bio || null,
        image_url: formData.image_url || null,
        email: formData.email || null,
        is_active: formData.is_active,
      };

      if (editingMember) {
        const { error } = await supabase
          .from("vorstand_members")
          .update(memberData)
          .eq("id", editingMember.id);

        if (error) throw error;
        
        toast({
          title: "Gespeichert",
          description: "Das Vorstandsmitglied wurde aktualisiert.",
        });
      } else {
        // Get max sort_order
        const maxOrder = members.length > 0 
          ? Math.max(...members.map(m => m.sort_order)) 
          : 0;
        
        const { error } = await supabase
          .from("vorstand_members")
          .insert({ ...memberData, sort_order: maxOrder + 1 });

        if (error) throw error;
        
        toast({
          title: "Erstellt",
          description: "Das Vorstandsmitglied wurde hinzugefügt.",
        });
      }

      setIsDialogOpen(false);
      fetchMembers();
    } catch (error) {
      console.error("Error saving vorstand member:", error);
      toast({
        title: "Fehler",
        description: "Speichern fehlgeschlagen.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("vorstand_members")
        .delete()
        .eq("id", memberToDelete.id);

      if (error) throw error;

      toast({
        title: "Gelöscht",
        description: "Das Vorstandsmitglied wurde entfernt.",
      });

      setDeleteDialogOpen(false);
      setMemberToDelete(null);
      fetchMembers();
    } catch (error) {
      console.error("Error deleting vorstand member:", error);
      toast({
        title: "Fehler",
        description: "Löschen fehlgeschlagen.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function moveUp(member: VorstandMember) {
    const index = members.findIndex(m => m.id === member.id);
    if (index <= 0) return;

    const prevMember = members[index - 1];
    
    try {
      await supabase
        .from("vorstand_members")
        .update({ sort_order: prevMember.sort_order })
        .eq("id", member.id);
      
      await supabase
        .from("vorstand_members")
        .update({ sort_order: member.sort_order })
        .eq("id", prevMember.id);
        
      fetchMembers();
    } catch (error) {
      console.error("Error reordering:", error);
    }
  }

  async function moveDown(member: VorstandMember) {
    const index = members.findIndex(m => m.id === member.id);
    if (index >= members.length - 1) return;

    const nextMember = members[index + 1];
    
    try {
      await supabase
        .from("vorstand_members")
        .update({ sort_order: nextMember.sort_order })
        .eq("id", member.id);
      
      await supabase
        .from("vorstand_members")
        .update({ sort_order: member.sort_order })
        .eq("id", nextMember.id);
        
      fetchMembers();
    } catch (error) {
      console.error("Error reordering:", error);
    }
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Vorstand verwalten
              </CardTitle>
              <CardDescription>
                Verwalten Sie die Vorstandsmitglieder und deren Informationen
              </CardDescription>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Neues Mitglied
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Noch keine Vorstandsmitglieder vorhanden.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Pos.</TableHead>
                  <TableHead className="w-16">Bild</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Bereich</TableHead>
                  <TableHead className="w-20">Status</TableHead>
                  <TableHead className="text-right w-32">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={index === 0}
                          onClick={() => moveUp(member)}
                        >
                          <GripVertical className="h-3 w-3 rotate-90" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={index === members.length - 1}
                          onClick={() => moveDown(member)}
                        >
                          <GripVertical className="h-3 w-3 -rotate-90" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.image_url || undefined} alt={member.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.bereich}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        member.is_active 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}>
                        {member.is_active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => openDeleteDialog(member)}
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
              {editingMember ? "Vorstandsmitglied bearbeiten" : "Neues Vorstandsmitglied"}
            </DialogTitle>
            <DialogDescription>
              {editingMember 
                ? "Aktualisieren Sie die Informationen des Vorstandsmitglieds" 
                : "Fügen Sie ein neues Vorstandsmitglied hinzu"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Profilbild</Label>
              <div className="flex items-start gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.image_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {formData.name ? getInitials(formData.name) : <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  {formData.image_url ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Ändern
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Entfernen
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Bild hochladen
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG oder WebP bis 5MB. Empfohlen: quadratisches Format.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                      e.target.value = '';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="z.B. Dr. Maria Schmidt"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Position *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="z.B. 1. Vorsitzende"
              />
            </div>

            {/* Bereich */}
            <div className="space-y-2">
              <Label htmlFor="bereich">Bereich *</Label>
              <Input
                id="bereich"
                value={formData.bereich}
                onChange={(e) => setFormData(prev => ({ ...prev, bereich: e.target.value }))}
                placeholder="z.B. Bildende Kunst"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail (optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="z.B. maria.schmidt@kulturrat-bs.de"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Kurzbiografie (optional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Eine kurze Beschreibung der Person..."
                rows={4}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Aktiv</Label>
                <p className="text-sm text-muted-foreground">
                  Inaktive Mitglieder werden nicht auf der Website angezeigt
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingMember ? "Speichern" : "Erstellen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vorstandsmitglied löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie "{memberToDelete?.name}" löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
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
