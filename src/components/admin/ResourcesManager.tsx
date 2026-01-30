import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, X, Eye, Loader2 } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  provider_name: string;
  provider_email: string;
  provider_phone: string | null;
  location: string;
  conditions: string | null;
  is_approved: boolean;
  is_available: boolean;
  created_at: string;
}

export function ResourcesManager() {
  const { toast } = useToast();
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Fehler",
        description: "Ressourcen konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleApprove = async (resourceId: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("resources")
        .update({ is_approved: true })
        .eq("id", resourceId);

      if (error) throw error;

      setResources(prev =>
        prev.map(r => (r.id === resourceId ? { ...r, is_approved: true } : r))
      );
      
      toast({
        title: "Ressource freigegeben",
        description: "Die Ressource ist jetzt öffentlich sichtbar.",
      });
      
      setIsDetailOpen(false);
    } catch (error) {
      console.error("Error approving resource:", error);
      toast({
        title: "Fehler",
        description: "Die Ressource konnte nicht freigegeben werden.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (resourceId: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("resources")
        .update({ is_approved: false })
        .eq("id", resourceId);

      if (error) throw error;

      setResources(prev =>
        prev.map(r => (r.id === resourceId ? { ...r, is_approved: false } : r))
      );
      
      toast({
        title: "Ressource zurückgezogen",
        description: "Die Ressource ist nicht mehr öffentlich sichtbar.",
      });
      
      setIsDetailOpen(false);
    } catch (error) {
      console.error("Error rejecting resource:", error);
      toast({
        title: "Fehler",
        description: "Die Ressource konnte nicht zurückgezogen werden.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const pendingResources = resources.filter(r => !r.is_approved);
  const approvedResources = resources.filter(r => r.is_approved);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Ressourcen verwalten</h2>
          <p className="text-muted-foreground">Prüfen und genehmigen Sie eingereichte Ressourcen</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Wartend auf Freigabe</CardDescription>
            <CardTitle className="text-3xl text-amber-600">{pendingResources.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Freigegebene Ressourcen</CardDescription>
            <CardTitle className="text-3xl text-primary">{approvedResources.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Gesamt</CardDescription>
            <CardTitle className="text-3xl">{resources.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Pending Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Wartende Ressourcen
          </CardTitle>
          <CardDescription>
            Diese Ressourcen warten auf Ihre Freigabe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : pendingResources.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Keine wartenden Ressourcen vorhanden.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Anbieter</TableHead>
                  <TableHead>Eingereicht</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">{resource.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </TableCell>
                    <TableCell>{resource.provider_name}</TableCell>
                    <TableCell>
                      {new Date(resource.created_at).toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedResource(resource);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(resource.id)}
                          disabled={isUpdating}
                        >
                          <Check className="h-4 w-4" />
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

      {/* Approved Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Freigegebene Ressourcen
          </CardTitle>
          <CardDescription>
            Diese Ressourcen sind öffentlich sichtbar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : approvedResources.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Noch keine freigegebenen Ressourcen.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Kategorie</TableHead>
                  <TableHead>Anbieter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">{resource.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </TableCell>
                    <TableCell>{resource.provider_name}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        Freigegeben
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedResource(resource);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleReject(resource.id)}
                          disabled={isUpdating}
                        >
                          <X className="h-4 w-4" />
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

      {/* Resource Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
            <DialogDescription>
              Eingereicht am{" "}
              {selectedResource &&
                new Date(selectedResource.created_at).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedResource && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Kategorie</p>
                  <p>{selectedResource.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Standort</p>
                  <p>{selectedResource.location}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Beschreibung</p>
                <p className="text-sm">{selectedResource.description}</p>
              </div>

              {selectedResource.conditions && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bedingungen</p>
                  <p className="text-sm">{selectedResource.conditions}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Anbieter</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{selectedResource.provider_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-Mail</p>
                    <p>{selectedResource.provider_email}</p>
                  </div>
                  {selectedResource.provider_phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <p>{selectedResource.provider_phone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={selectedResource.is_available ? "default" : "secondary"}>
                  {selectedResource.is_available ? "Verfügbar" : "Nicht verfügbar"}
                </Badge>
                <Badge variant={selectedResource.is_approved ? "default" : "secondary"}>
                  {selectedResource.is_approved ? "Freigegeben" : "Wartend"}
                </Badge>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedResource && !selectedResource.is_approved ? (
              <>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Abbrechen
                </Button>
                <Button
                  onClick={() => handleApprove(selectedResource.id)}
                  disabled={isUpdating}
                >
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Check className="mr-2 h-4 w-4" />
                  Freigeben
                </Button>
              </>
            ) : selectedResource ? (
              <>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Schließen
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedResource.id)}
                  disabled={isUpdating}
                >
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <X className="mr-2 h-4 w-4" />
                  Freigabe entziehen
                </Button>
              </>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
