import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Inbox, Send as SendIcon, Check, X } from "lucide-react";

type Status = "pending" | "accepted" | "declined" | "completed" | "cancelled";

interface RequestRow {
  id: string;
  resource_id: string;
  requester_id: string;
  requester_name: string;
  requester_email: string;
  requester_phone: string | null;
  message: string;
  desired_period: string | null;
  status: Status;
  provider_response: string | null;
  created_at: string;
  resources?: { title: string; submitted_by: string | null } | null;
}

const statusLabel: Record<Status, string> = {
  pending: "Offen",
  accepted: "Akzeptiert",
  declined: "Abgelehnt",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

const statusVariant: Record<Status, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  accepted: "default",
  declined: "destructive",
  completed: "outline",
  cancelled: "outline",
};

export function MyRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [outgoing, setOutgoing] = useState<RequestRow[]>([]);
  const [incoming, setIncoming] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState<Record<string, string>>({});
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [outRes, inRes] = await Promise.all([
      supabase
        .from("resource_requests")
        .select("*, resources(title, submitted_by)")
        .eq("requester_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("resource_requests")
        .select("*, resources!inner(title, submitted_by)")
        .eq("resources.submitted_by", user.id)
        .order("created_at", { ascending: false }),
    ]);
    if (outRes.data) setOutgoing(outRes.data as RequestRow[]);
    if (inRes.data) setIncoming(inRes.data as RequestRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const respond = async (id: string, status: "accepted" | "declined" | "completed") => {
    setUpdating(id);
    const { error } = await supabase
      .from("resource_requests")
      .update({
        status,
        provider_response: responseText[id]?.trim() || null,
        responded_at: new Date().toISOString(),
      })
      .eq("id", id);
    setUpdating(null);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Antwort gespeichert" });
    load();
  };

  const cancel = async (id: string) => {
    setUpdating(id);
    const { error } = await supabase
      .from("resource_requests")
      .update({ status: "cancelled" })
      .eq("id", id);
    setUpdating(null);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Anfrage storniert" });
    load();
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Incoming */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Inbox className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Erhaltene Anfragen ({incoming.length})</h3>
        </div>
        {incoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">Keine Anfragen für deine Ressourcen.</p>
        ) : (
          <div className="space-y-3">
            {incoming.map((r) => (
              <Card key={r.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{r.resources?.title}</CardTitle>
                      <CardDescription>
                        von {r.requester_name} · {new Date(r.created_at).toLocaleDateString("de-DE")}
                      </CardDescription>
                    </div>
                    <Badge variant={statusVariant[r.status]}>{statusLabel[r.status]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {r.desired_period && <p className="text-sm"><strong>Zeitraum:</strong> {r.desired_period}</p>}
                  <p className="text-sm whitespace-pre-wrap">{r.message}</p>
                  <div className="text-xs text-muted-foreground">
                    Kontakt: {r.requester_email}{r.requester_phone ? ` · ${r.requester_phone}` : ""}
                  </div>
                  {r.provider_response && (
                    <div className="rounded-md bg-muted/50 p-3 text-sm">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Deine Antwort:</p>
                      {r.provider_response}
                    </div>
                  )}
                  {r.status === "pending" && (
                    <div className="space-y-2 pt-2 border-t">
                      <Textarea
                        placeholder="Antwort an Anfragenden (optional)…"
                        value={responseText[r.id] || ""}
                        onChange={(e) => setResponseText((p) => ({ ...p, [r.id]: e.target.value }))}
                        rows={2}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => respond(r.id, "declined")} disabled={updating === r.id}>
                          <X className="mr-1 h-4 w-4" /> Ablehnen
                        </Button>
                        <Button size="sm" onClick={() => respond(r.id, "accepted")} disabled={updating === r.id}>
                          <Check className="mr-1 h-4 w-4" /> Akzeptieren
                        </Button>
                      </div>
                    </div>
                  )}
                  {r.status === "accepted" && (
                    <div className="flex justify-end pt-2 border-t">
                      <Button size="sm" variant="outline" onClick={() => respond(r.id, "completed")} disabled={updating === r.id}>
                        Als abgeschlossen markieren
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Outgoing */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <SendIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Meine Anfragen ({outgoing.length})</h3>
        </div>
        {outgoing.length === 0 ? (
          <p className="text-sm text-muted-foreground">Du hast noch keine Anfragen gestellt.</p>
        ) : (
          <div className="space-y-3">
            {outgoing.map((r) => (
              <Card key={r.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{r.resources?.title}</CardTitle>
                      <CardDescription>{new Date(r.created_at).toLocaleDateString("de-DE")}</CardDescription>
                    </div>
                    <Badge variant={statusVariant[r.status]}>{statusLabel[r.status]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {r.desired_period && <p className="text-sm"><strong>Zeitraum:</strong> {r.desired_period}</p>}
                  <p className="text-sm whitespace-pre-wrap">{r.message}</p>
                  {r.provider_response && (
                    <div className="rounded-md bg-muted/50 p-3 text-sm">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Antwort des Anbieters:</p>
                      {r.provider_response}
                    </div>
                  )}
                  {r.status === "pending" && (
                    <div className="flex justify-end pt-2 border-t">
                      <Button size="sm" variant="outline" onClick={() => cancel(r.id)} disabled={updating === r.id}>
                        Anfrage zurückziehen
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}