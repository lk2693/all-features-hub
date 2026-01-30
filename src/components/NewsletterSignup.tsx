import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein");

interface NewsletterSignupProps {
  variant?: "inline" | "card";
  className?: string;
}

export function NewsletterSignup({ variant = "inline", className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate email
    const validation = emailSchema.safeParse(email.trim());
    if (!validation.success) {
      setErrorMessage(validation.error.errors[0].message);
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation - already subscribed
          setErrorMessage("Diese E-Mail-Adresse ist bereits angemeldet.");
          setStatus("error");
        } else {
          throw error;
        }
        return;
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Newsletter signup error:", error);
      setErrorMessage("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
      setStatus("error");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  if (variant === "card") {
    return (
      <div className={`rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">Newsletter</h3>
            <p className="text-sm text-muted-foreground">Bleiben Sie informiert</p>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 py-4"
            >
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Vielen Dank!</p>
                <p className="text-sm text-muted-foreground">
                  Sie erhalten bald unseren Newsletter.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") resetForm();
                  }}
                  disabled={status === "loading"}
                  className="bg-background"
                  aria-label="E-Mail-Adresse für Newsletter"
                />
                {status === "error" && errorMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errorMessage}
                  </motion.p>
                )}
              </div>
              <Button
                type="submit"
                disabled={status === "loading" || !email.trim()}
                className="w-full"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Anmelden"
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Mit der Anmeldung stimmen Sie unserer{" "}
                <a href="/datenschutz" className="underline hover:text-foreground">
                  Datenschutzerklärung
                </a>{" "}
                zu.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Inline variant (for footer, etc.)
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2 text-sm"
          >
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Erfolgreich angemeldet!</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-2"
          >
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="E-Mail-Adresse"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") resetForm();
                }}
                disabled={status === "loading"}
                className="flex-1"
                aria-label="E-Mail-Adresse für Newsletter"
              />
              <Button
                type="submit"
                size="sm"
                disabled={status === "loading" || !email.trim()}
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>
            </div>
            {status === "error" && errorMessage && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive"
              >
                {errorMessage}
              </motion.p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
