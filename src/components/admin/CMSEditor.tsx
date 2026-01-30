import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, RotateCcw } from "lucide-react";

interface CMSContent {
  id: string;
  block_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
}

interface HeroFormData {
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
}

const defaultHeroData: HeroFormData = {
  title: "Gemeinsam für Kultur in Braunschweig",
  subtitle: "Der Kulturrat Braunschweig vernetzt Kulturschaffende, fördert den Austausch und stärkt die kulturelle Vielfalt unserer Stadt.",
  cta_text: "Mehr erfahren",
  cta_link: "/ueber-uns",
};

export function CMSEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [heroContent, setHeroContent] = useState<CMSContent | null>(null);
  const [heroFormData, setHeroFormData] = useState<HeroFormData>(defaultHeroData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchCMSContent();
  }, []);

  async function fetchCMSContent() {
    try {
      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .eq("block_key", "hero")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setHeroContent(data);
        setHeroFormData({
          title: data.title || defaultHeroData.title,
          subtitle: data.subtitle || defaultHeroData.subtitle,
          cta_text: data.cta_text || defaultHeroData.cta_text,
          cta_link: data.cta_link || defaultHeroData.cta_link,
        });
      }
    } catch (error) {
      console.error("Error fetching CMS content:", error);
      toast({
        title: "Fehler",
        description: "CMS-Inhalte konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleInputChange(field: keyof HeroFormData, value: string) {
    setHeroFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }

  function handleReset() {
    if (heroContent) {
      setHeroFormData({
        title: heroContent.title || defaultHeroData.title,
        subtitle: heroContent.subtitle || defaultHeroData.subtitle,
        cta_text: heroContent.cta_text || defaultHeroData.cta_text,
        cta_link: heroContent.cta_link || defaultHeroData.cta_link,
      });
    } else {
      setHeroFormData(defaultHeroData);
    }
    setHasChanges(false);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const updateData = {
        title: heroFormData.title,
        subtitle: heroFormData.subtitle,
        cta_text: heroFormData.cta_text,
        cta_link: heroFormData.cta_link,
        updated_by: user?.id,
      };

      if (heroContent) {
        const { error } = await supabase
          .from("cms_content")
          .update(updateData)
          .eq("block_key", "hero");

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("cms_content")
          .insert({ ...updateData, block_key: "hero" })
          .select()
          .single();

        if (error) throw error;
        setHeroContent(data);
      }

      setHasChanges(false);
      toast({
        title: "Gespeichert",
        description: "Die Änderungen wurden gespeichert.",
      });
    } catch (error) {
      console.error("Error saving CMS content:", error);
      toast({
        title: "Fehler",
        description: "Speichern fehlgeschlagen.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inhalte bearbeiten</h2>
          <p className="text-muted-foreground">Passen Sie die Inhalte Ihrer Website an</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Zurücksetzen
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Speichern
          </Button>
        </div>
      </div>

      {/* Hero Section Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Hero-Bereich</CardTitle>
          <CardDescription>
            Der Hero-Bereich ist das erste, was Besucher auf der Startseite sehen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Hauptüberschrift</Label>
            <Input
              id="hero-title"
              value={heroFormData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Überschrift eingeben..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Unterüberschrift</Label>
            <Textarea
              id="hero-subtitle"
              value={heroFormData.subtitle}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              placeholder="Beschreibung eingeben..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero-cta-text">Button-Text</Label>
              <Input
                id="hero-cta-text"
                value={heroFormData.cta_text}
                onChange={(e) => handleInputChange("cta_text", e.target.value)}
                placeholder="z.B. Mehr erfahren"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-cta-link">Button-Link</Label>
              <Input
                id="hero-cta-link"
                value={heroFormData.cta_link}
                onChange={(e) => handleInputChange("cta_link", e.target.value)}
                placeholder="z.B. /ueber-uns"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-6 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground mb-4">Vorschau</p>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              {heroFormData.title}
            </h3>
            <p className="text-muted-foreground mb-4">
              {heroFormData.subtitle}
            </p>
            <Button size="sm" disabled>
              {heroFormData.cta_text} →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Future CMS blocks can be added here */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Weitere Blöcke</CardTitle>
          <CardDescription>
            Zusätzliche bearbeitbare Bereiche können hier hinzugefügt werden (z.B. Footer, Über uns, etc.)
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
