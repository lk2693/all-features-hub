import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, CheckCircle, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
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
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

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
      <div className={`relative rounded-3xl overflow-hidden bg-card border border-border/50 p-8 md:p-10 ${className}`}>
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
            <Sparkles className="h-3 w-3" />
            Newsletter
          </div>

          <h3 className="font-display text-2xl font-bold text-foreground mb-2">
            Immer auf dem Laufenden
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Kulturpolitik, Events & Förderinfos direkt in dein Postfach.
          </p>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10"
              >
                <div className="flex-shrink-0 p-2.5 rounded-full bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Willkommen an Bord!</p>
                  <p className="text-sm text-muted-foreground">
                    Du erhältst bald unseren Newsletter.
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
                className="space-y-4"
              >
                <div
                  className={`flex items-center gap-2 rounded-full border bg-background px-2 py-1.5 transition-all duration-300 ${
                    isFocused
                      ? "border-primary/50 shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                      : "border-border"
                  }`}
                >
                  <Mail className="h-4 w-4 text-muted-foreground ml-3 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="deine@email.de"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") resetForm();
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={status === "loading"}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-2"
                    aria-label="E-Mail-Adresse für Newsletter"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading" || !email.trim()}
                    className="flex-shrink-0 p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {status === "error" && errorMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1.5 pl-2"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errorMessage}
                  </motion.p>
                )}

                <p className="text-xs text-muted-foreground/60 pl-2">
                  Mit der Anmeldung stimmst du unserer{" "}
                  <a href="/datenschutz" className="underline hover:text-muted-foreground transition-colors">
                    Datenschutzerklärung
                  </a>{" "}
                  zu.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Inline variant (for footer)
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2.5 py-2"
          >
            <div className="p-1.5 rounded-full bg-primary/10">
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Erfolgreich angemeldet!</span>
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
            <div
              className={`flex items-center gap-2 rounded-full border bg-background/5 px-2 py-1 transition-all duration-300 ${
                isFocused
                  ? "border-primary/40 shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]"
                  : "border-border/50"
              }`}
            >
              <input
                type="email"
                placeholder="E-Mail-Adresse"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") resetForm();
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={status === "loading"}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none py-2 pl-3"
                aria-label="E-Mail-Adresse für Newsletter"
              />
              <button
                type="submit"
                disabled={status === "loading" || !email.trim()}
                className="flex-shrink-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {status === "loading" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            {status === "error" && errorMessage && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-destructive pl-3"
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
