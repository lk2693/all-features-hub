import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, LogIn } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  resource: { id: string; title: string; provider_name: string } | null;
}

export function ResourceRequestDialog({ open, onOpenChange, resource }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [period, setPeriod] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) setEmail(user.email ?? "");
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !resource) return;
    if (message.trim().length < 10) {
      toast({ title: "Nachricht zu kurz", description: "Bitte beschreibe dein Anliegen genauer (mind. 10 Zeichen).", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("resource_requests").insert({
      resource_id: resource.id,
      requester_id: user.id,
      requester_name: name.trim(),
      requester_email: email.trim(),
      requester_phone: phone.trim() || null,
      desired_period: period.trim() || null,
      message: message.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Anfrage gesendet", description: `Deine Anfrage an ${resource.provider_name} wurde übermittelt.` });
    setName(""); setPhone(""); setPeriod(""); setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ressource anfragen</DialogTitle>
          <DialogDescription>
            {resource ? <>Anfrage für <strong>{resource.title}</strong> bei {resource.provider_name}</> : null}
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="py-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Du musst angemeldet sein, um eine Ressource anzufragen.
            </p>
            <Button asChild>
              <Link to="/auth"><LogIn className="mr-2 h-4 w-4" /> Anmelden</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="rq-name">Dein Name *</Label>
                <Input id="rq-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rq-email">E-Mail *</Label>
                <Input id="rq-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="rq-phone">Telefon (optional)</Label>
                <Input id="rq-phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={50} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rq-period">Gewünschter Zeitraum</Label>
                <Input id="rq-period" placeholder="z.B. 12.–14. Mai" value={period} onChange={(e) => setPeriod(e.target.value)} maxLength={100} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rq-msg">Nachricht *</Label>
              <Textarea
                id="rq-msg"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Wofür benötigst du die Ressource? Wann und wie lange?"
                required
                maxLength={1500}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Anfrage senden
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}