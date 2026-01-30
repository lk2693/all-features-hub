import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ArrowLeft, Send, Monitor, Home, Lightbulb, Music, Camera, Wrench, CheckCircle, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { cn } from "@/lib/utils";

const categories = [
  { id: "technik", label: "Technik", icon: Monitor, description: "Beamer, Licht, Sound, etc." },
  { id: "raeume", label: "Räume", icon: Home, description: "Probe-, Aufführungs-, Atelierräume" },
  { id: "knowhow", label: "Know-how", icon: Lightbulb, description: "Beratung, Workshops, Expertise" },
  { id: "instrumente", label: "Instrumente", icon: Music, description: "Musikinstrumente zum Ausleihen" },
  { id: "medien", label: "Medien", icon: Camera, description: "Foto- und Videoequipment" },
  { id: "werkzeuge", label: "Werkzeuge", icon: Wrench, description: "Handwerk und Aufbau" },
];

// Validation schema
const resourceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Titel muss mindestens 3 Zeichen haben" })
    .max(100, { message: "Titel darf maximal 100 Zeichen haben" }),
  description: z
    .string()
    .trim()
    .min(20, { message: "Beschreibung muss mindestens 20 Zeichen haben" })
    .max(500, { message: "Beschreibung darf maximal 500 Zeichen haben" }),
  category: z
    .string()
    .min(1, { message: "Bitte wähle eine Kategorie" }),
  providerName: z
    .string()
    .trim()
    .min(2, { message: "Name muss mindestens 2 Zeichen haben" })
    .max(100, { message: "Name darf maximal 100 Zeichen haben" }),
  providerEmail: z
    .string()
    .trim()
    .email({ message: "Bitte gib eine gültige E-Mail-Adresse ein" })
    .max(255, { message: "E-Mail darf maximal 255 Zeichen haben" }),
  providerPhone: z
    .string()
    .trim()
    .max(30, { message: "Telefonnummer darf maximal 30 Zeichen haben" })
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .trim()
    .min(3, { message: "Standort muss mindestens 3 Zeichen haben" })
    .max(200, { message: "Standort darf maximal 200 Zeichen haben" }),
  conditions: z
    .string()
    .trim()
    .max(500, { message: "Konditionen dürfen maximal 500 Zeichen haben" })
    .optional()
    .or(z.literal("")),
  privacy: z
    .boolean()
    .refine((val) => val === true, { message: "Du musst der Datenschutzerklärung zustimmen" }),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

type FormErrors = Partial<Record<keyof ResourceFormData, string>>;

export default function RessourcenEintragen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<ResourceFormData>({
    title: "",
    description: "",
    category: "",
    providerName: "",
    providerEmail: "",
    providerPhone: "",
    location: "",
    conditions: "",
    privacy: false,
  });

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email && !formData.providerEmail) {
      setFormData((prev) => ({ ...prev, providerEmail: user.email || "" }));
    }
    if (user?.user_metadata?.display_name && !formData.providerName) {
      setFormData((prev) => ({ ...prev, providerName: user.user_metadata.display_name || "" }));
    }
  }, [user]);

  const updateField = <K extends keyof ResourceFormData>(
    field: K,
    value: ResourceFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melde dich an, um eine Ressource einzutragen.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const result = resourceSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as keyof ResourceFormData;
        if (!fieldErrors[path]) {
          fieldErrors[path] = err.message;
        }
      });
      setErrors(fieldErrors);
      
      toast({
        title: "Formular unvollständig",
        description: "Bitte überprüfe deine Eingaben.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("resources").insert({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      provider_name: formData.providerName,
      provider_email: formData.providerEmail,
      provider_phone: formData.providerPhone || null,
      location: formData.location,
      conditions: formData.conditions || null,
      submitted_by: user.id,
      is_approved: false,
      is_available: true,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Fehler beim Speichern",
        description: "Die Ressource konnte nicht gespeichert werden. Bitte versuche es später erneut.",
        variant: "destructive",
      });
      return;
    }

    setIsSuccess(true);

    toast({
      title: "Ressource eingereicht! ✓",
      description: "Wir prüfen deinen Eintrag und schalten ihn bald frei.",
    });
  };

  // Show loading state
  if (authLoading) {
    return (
      <Layout>
        <section className="py-16 lg:py-24 bg-gradient-section min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </section>
      </Layout>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <Layout>
        <section className="py-16 lg:py-24 bg-gradient-section min-h-[60vh] flex items-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <LogIn className="h-10 w-10 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Anmeldung erforderlich
              </h1>
              <p className="text-muted-foreground mb-8">
                Um eine Ressource einzutragen, musst du dich zuerst anmelden oder registrieren.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-hero hover:opacity-90" asChild>
                  <Link to="/auth">
                    <LogIn className="mr-2 h-4 w-4" />
                    Anmelden / Registrieren
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => navigate("/ressourcen")}>
                  Zurück zum Ressourcenpool
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  if (isSuccess) {
    return (
      <Layout>
        <section className="py-16 lg:py-24 bg-gradient-section min-h-[60vh] flex items-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Vielen Dank!
              </h1>
              <p className="text-muted-foreground mb-8">
                Deine Ressource wurde erfolgreich eingereicht. Wir prüfen den Eintrag und 
                schalten ihn innerhalb von 2-3 Werktagen frei. Du erhältst eine Bestätigung per E-Mail.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate("/ressourcen")}>
                  Zum Ressourcenpool
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    providerName: user?.user_metadata?.display_name || "",
                    providerEmail: user?.email || "",
                    providerPhone: "",
                    location: "",
                    conditions: "",
                    privacy: false,
                  });
                }}>
                  Weitere Ressource eintragen
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 lg:py-16 bg-gradient-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              variant="ghost" 
              className="mb-6 -ml-2"
              onClick={() => navigate("/ressourcen")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zum Ressourcenpool
            </Button>
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Ressource eintragen
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Teile deine Ressourcen mit anderen Kulturschaffenden. Ob Technik, Räume oder Know-how – 
              jeder Beitrag stärkt unsere Gemeinschaft.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Ressource beschreiben</CardTitle>
                <CardDescription>
                  Alle Felder mit * sind Pflichtfelder. Der Eintrag wird nach Prüfung freigeschaltet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Category Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Kategorie *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => updateField("category", cat.id)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center",
                            formData.category === cat.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          )}
                        >
                          <cat.icon className={cn(
                            "h-6 w-6",
                            formData.category === cat.id ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span className={cn(
                            "text-sm font-medium",
                            formData.category === cat.id ? "text-primary" : "text-foreground"
                          )}>
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category}</p>
                    )}
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Titel der Ressource *</Label>
                    <Input
                      id="title"
                      placeholder="z.B. PA-Anlage für Veranstaltungen"
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className={cn(errors.title && "border-destructive")}
                      maxLength={100}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formData.title.length}/100 Zeichen</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Beschreibung *</Label>
                    <Textarea
                      id="description"
                      placeholder="Beschreibe die Ressource genauer: Was beinhaltet sie? Für welche Zwecke ist sie geeignet?"
                      value={formData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      className={cn("min-h-[120px]", errors.description && "border-destructive")}
                      maxLength={500}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formData.description.length}/500 Zeichen</p>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Standort / Abholung *</Label>
                    <Input
                      id="location"
                      placeholder="z.B. Kulturzentrum, Musterstraße 1, Braunschweig"
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className={cn(errors.location && "border-destructive")}
                      maxLength={200}
                    />
                    {errors.location && (
                      <p className="text-sm text-destructive">{errors.location}</p>
                    )}
                  </div>

                  {/* Conditions */}
                  <div className="space-y-2">
                    <Label htmlFor="conditions">Konditionen (optional)</Label>
                    <Textarea
                      id="conditions"
                      placeholder="z.B. kostenlos für Mitglieder, Kaution 50€, nur nach Absprache..."
                      value={formData.conditions}
                      onChange={(e) => updateField("conditions", e.target.value)}
                      className={cn("min-h-[80px]", errors.conditions && "border-destructive")}
                      maxLength={500}
                    />
                    {errors.conditions && (
                      <p className="text-sm text-destructive">{errors.conditions}</p>
                    )}
                  </div>

                  <hr className="border-border" />

                  {/* Contact Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-display text-lg font-semibold mb-1">Anbieter:in</h3>
                      <p className="text-sm text-muted-foreground">
                        Diese Informationen werden im Ressourcenpool angezeigt.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="providerName">Name / Organisation *</Label>
                        <Input
                          id="providerName"
                          placeholder="z.B. Kulturverein Braunschweig"
                          value={formData.providerName}
                          onChange={(e) => updateField("providerName", e.target.value)}
                          className={cn(errors.providerName && "border-destructive")}
                          maxLength={100}
                        />
                        {errors.providerName && (
                          <p className="text-sm text-destructive">{errors.providerName}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="providerPhone">Telefon (optional)</Label>
                        <Input
                          id="providerPhone"
                          type="tel"
                          placeholder="z.B. 0531 123456"
                          value={formData.providerPhone}
                          onChange={(e) => updateField("providerPhone", e.target.value)}
                          className={cn(errors.providerPhone && "border-destructive")}
                          maxLength={30}
                        />
                        {errors.providerPhone && (
                          <p className="text-sm text-destructive">{errors.providerPhone}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="providerEmail">E-Mail *</Label>
                      <Input
                        id="providerEmail"
                        type="email"
                        placeholder="kontakt@beispiel.de"
                        value={formData.providerEmail}
                        onChange={(e) => updateField("providerEmail", e.target.value)}
                        className={cn(errors.providerEmail && "border-destructive")}
                        maxLength={255}
                      />
                      {errors.providerEmail && (
                        <p className="text-sm text-destructive">{errors.providerEmail}</p>
                      )}
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Privacy */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="privacy"
                        checked={formData.privacy}
                        onCheckedChange={(checked) => updateField("privacy", checked === true)}
                        className={cn(errors.privacy && "border-destructive")}
                      />
                      <div className="space-y-1">
                        <label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                          Ich habe die{" "}
                          <a href="/datenschutz" target="_blank" className="text-primary hover:underline">
                            Datenschutzerklärung
                          </a>{" "}
                          gelesen und stimme der Veröffentlichung meiner Kontaktdaten im Ressourcenpool zu. *
                        </label>
                        {errors.privacy && (
                          <p className="text-sm text-destructive">{errors.privacy}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="bg-gradient-hero hover:opacity-90 flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Wird eingereicht...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Ressource einreichen
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="lg"
                      onClick={() => navigate("/ressourcen")}
                    >
                      Abbrechen
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
