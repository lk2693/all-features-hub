import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings, Shield, BarChart3, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

export default function CookieBanner() {
  const { hasConsented, consent, acceptAll, acceptNecessary, updateConsent, saveConsent } =
    useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);

  if (hasConsented) return null;

  return (
    <>
      <AnimatePresence>
        {!hasConsented && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-tertiary p-6 shadow-2xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                <div className="flex items-start gap-4 lg:flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Cookie className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-tertiary-foreground">
                      Cookie-Einstellungen
                    </h3>
                    <p className="mt-1 text-sm text-tertiary-foreground/70">
                      Wir nutzen Cookies, um dir die bestmögliche Erfahrung zu bieten. Einige sind
                      notwendig, andere helfen uns, die Website zu verbessern.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => setShowSettings(true)}
                    className="border-tertiary-foreground/20 text-tertiary-foreground hover:bg-tertiary-foreground/10"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Einstellungen
                  </Button>
                  <Button
                    variant="outline"
                    onClick={acceptNecessary}
                    className="border-tertiary-foreground/20 text-tertiary-foreground hover:bg-tertiary-foreground/10"
                  >
                    Nur notwendige
                  </Button>
                  <Button onClick={acceptAll} className="bg-gradient-hero hover:opacity-90">
                    Alle akzeptieren
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <Cookie className="h-5 w-5 text-primary" />
              Cookie-Einstellungen
            </DialogTitle>
            <DialogDescription>
              Wähle aus, welche Cookie-Kategorien du akzeptieren möchtest.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Notwendig</p>
                  <p className="text-sm text-muted-foreground">
                    Erforderlich für grundlegende Funktionen wie Anmeldung und Sicherheit.
                  </p>
                </div>
              </div>
              <Switch checked disabled aria-label="Notwendige Cookies (immer aktiv)" />
            </div>

            {/* Statistics Cookies */}
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Statistik</p>
                  <p className="text-sm text-muted-foreground">
                    Helfen uns zu verstehen, wie Besucher die Website nutzen.
                  </p>
                </div>
              </div>
              <Switch
                checked={consent.statistics}
                onCheckedChange={(checked) => updateConsent("statistics", checked)}
                aria-label="Statistik-Cookies"
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                  <Megaphone className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">Marketing</p>
                  <p className="text-sm text-muted-foreground">
                    Ermöglichen personalisierte Inhalte und Newsletter-Tracking.
                  </p>
                </div>
              </div>
              <Switch
                checked={consent.marketing}
                onCheckedChange={(checked) => updateConsent("marketing", checked)}
                aria-label="Marketing-Cookies"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                acceptNecessary();
                setShowSettings(false);
              }}
            >
              Nur notwendige
            </Button>
            <Button
              onClick={() => {
                saveConsent();
                setShowSettings(false);
              }}
              className="bg-gradient-hero hover:opacity-90"
            >
              Auswahl speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
