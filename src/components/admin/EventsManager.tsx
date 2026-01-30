import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_all_day: boolean;
  category: string;
  organizer: string | null;
  website_url: string | null;
  is_published: boolean;
  created_at: string;
}

const categories = [
  { value: "veranstaltung", label: "Veranstaltung" },
  { value: "sitzung", label: "Sitzung" },
  { value: "frist", label: "Frist" },
  { value: "networking", label: "Networking" },
  { value: "workshop", label: "Workshop" },
];

export function EventsManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [category, setCategory] = useState("veranstaltung");
  const [organizer, setOrganizer] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: true });
      if (error) throw error;
      return data as Event[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (isNew: boolean) => {
      // Combine date and time
      const startDateTime = isAllDay
        ? `${startDate}T00:00:00`
        : `${startDate}T${startTime || "00:00"}:00`;
      
      let endDateTime = null;
      if (endDate) {
        endDateTime = isAllDay
          ? `${endDate}T23:59:59`
          : `${endDate}T${endTime || "23:59"}:00`;
      } else if (!isAllDay && endTime) {
        endDateTime = `${startDate}T${endTime}:00`;
      }

      const eventData = {
        title,
        description: description || null,
        location: location || null,
        start_date: startDateTime,
        end_date: endDateTime,
        is_all_day: isAllDay,
        category,
        organizer: organizer || null,
        website_url: websiteUrl || null,
        created_by: user?.id,
      };

      if (isNew) {
        const { error } = await supabase.from("events").insert(eventData);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", editingEvent!.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Gespeichert", description: "Die Veranstaltung wurde gespeichert." });
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
        .from("events")
        .update({ is_published: !isPublished })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Status geändert" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Gelöscht", description: "Die Veranstaltung wurde gelöscht." });
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setIsAllDay(false);
    setCategory("veranstaltung");
    setOrganizer("");
    setWebsiteUrl("");
    setEditingEvent(null);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description || "");
    setLocation(event.location || "");
    
    const start = parseISO(event.start_date);
    setStartDate(format(start, "yyyy-MM-dd"));
    setStartTime(format(start, "HH:mm"));
    
    if (event.end_date) {
      const end = parseISO(event.end_date);
      setEndDate(format(end, "yyyy-MM-dd"));
      setEndTime(format(end, "HH:mm"));
    } else {
      setEndDate("");
      setEndTime("");
    }
    
    setIsAllDay(event.is_all_day);
    setCategory(event.category);
    setOrganizer(event.organizer || "");
    setWebsiteUrl(event.website_url || "");
    setIsDialogOpen(true);
  };

  const handleNewEvent = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const formatDisplayDate = (dateStr: string) => {
    return format(parseISO(dateStr), "d. MMM yyyy, HH:mm", { locale: de });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Veranstaltungen verwalten</h2>
          <p className="text-sm text-muted-foreground">
            Erstellen und bearbeiten Sie Termine für den Kalender.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewEvent} className="gap-2">
              <Plus className="h-4 w-4" />
              Neue Veranstaltung
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Veranstaltung bearbeiten" : "Neue Veranstaltung"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate(!editingEvent);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z.B. Vollversammlung Kulturrat"
                  required
                />
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
                  <Label htmlFor="organizer">Veranstalter</Label>
                  <Input
                    id="organizer"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="z.B. Kulturrat Braunschweig"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isAllDay"
                  checked={isAllDay}
                  onCheckedChange={(checked) => setIsAllDay(checked === true)}
                />
                <Label htmlFor="isAllDay" className="cursor-pointer">
                  Ganztägige Veranstaltung
                </Label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Startdatum *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                {!isAllDay && (
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Startzeit</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="endDate">Enddatum</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                {!isAllDay && (
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Endzeit</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ort</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="z.B. Rathaus Braunschweig, Saal 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details zur Veranstaltung..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website / Link</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
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
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Noch keine Veranstaltungen vorhanden.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium truncate">{event.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {categories.find((c) => c.value === event.category)?.label}
                      </Badge>
                      {event.is_published ? (
                        <Badge className="bg-primary/10 text-primary text-xs">
                          Veröffentlicht
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Entwurf
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDisplayDate(event.start_date)}
                      {event.location && ` • ${event.location}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      togglePublishMutation.mutate({
                        id: event.id,
                        isPublished: event.is_published,
                      })
                    }
                    title={event.is_published ? "Depublizieren" : "Veröffentlichen"}
                  >
                    {event.is_published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(event)}
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
                        <AlertDialogTitle>Veranstaltung löschen?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Möchten Sie "{event.title}" wirklich löschen? Diese Aktion kann nicht
                          rückgängig gemacht werden.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(event.id)}
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
