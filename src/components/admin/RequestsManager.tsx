import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";

type Status = "pending" | "accepted" | "declined" | "completed" | "cancelled";

interface Row {
  id: string;
  requester_name: string;
  requester_email: string;
  message: string;
  desired_period: string | null;
  status: Status;
  created_at: string;
  resources?: { title: string; provider_name: string } | null;
}

const statusLabel: Record<Status, string> = {
  pending: "Offen",
  accepted: "Akzeptiert",
  declined: "Abgelehnt",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

export function RequestsManager() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("resource_requests")
      .select("*, resources(title, provider_name)")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    else setRows((data as Row[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Anfrage wirklich löschen?")) return;
    const { error } = await supabase.from("resource_requests").delete().eq("id", id);
    if (error) toast({ title: "Fehler", description: error.message, variant: "destructive" });
    else { toast({ title: "Gelöscht" }); load(); }
  };

  const counts = {
    pending: rows.filter(r => r.status === "pending").length,
    accepted: rows.filter(r => r.status === "accepted").length,
    total: rows.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ressourcen-Anfragen</h2>
        <p className="text-muted-foreground">Übersicht aller Anfragen zwischen Mitgliedern</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardDescription>Offen</CardDescription><CardTitle className="text-3xl text-amber-600">{counts.pending}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Akzeptiert</CardDescription><CardTitle className="text-3xl text-primary">{counts.accepted}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Gesamt</CardDescription><CardTitle className="text-3xl">{counts.total}</CardTitle></CardHeader></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle Anfragen</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : rows.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Noch keine Anfragen.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Ressource</TableHead>
                  <TableHead>Anfragender</TableHead>
                  <TableHead>Anbieter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm">{new Date(r.created_at).toLocaleDateString("de-DE")}</TableCell>
                    <TableCell className="font-medium">{r.resources?.title ?? "—"}</TableCell>
                    <TableCell className="text-sm">{r.requester_name}<br /><span className="text-xs text-muted-foreground">{r.requester_email}</span></TableCell>
                    <TableCell className="text-sm">{r.resources?.provider_name ?? "—"}</TableCell>
                    <TableCell><Badge variant="secondary">{statusLabel[r.status]}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => remove(r.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}