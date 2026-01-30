import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, RotateCcw, Home, Users, Calendar, Euro, Upload, X, Image } from "lucide-react";

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

interface BlockFormData {
  title: string;
  subtitle: string;
  content: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
}

const pageBlocks = {
  home: [
    { 
      key: "hero", 
      label: "Hero-Bereich", 
      description: "Der erste Bereich, den Besucher auf der Startseite sehen",
      fields: ["title", "subtitle", "image_url", "cta_text", "cta_link"]
    },
  ],
  ueberuns: [
    { 
      key: "ueberuns_hero", 
      label: "Hero-Bereich", 
      description: "Einführung zur Über-uns-Seite",
      fields: ["title", "subtitle", "image_url"]
    },
    { 
      key: "ueberuns_mission", 
      label: "Mission", 
      description: "Beschreibung der Mission des Kulturrats",
      fields: ["title", "content"]
    },
  ],
  kalender: [
    { 
      key: "kalender_hero", 
      label: "Hero-Bereich", 
      description: "Einführung zum Veranstaltungskalender",
      fields: ["title", "subtitle", "image_url"]
    },
  ],
  foerderung: [
    { 
      key: "foerderung_hero", 
      label: "Hero-Bereich", 
      description: "Einführung zur Förderinfos-Seite",
      fields: ["title", "subtitle", "image_url"]
    },
    { 
      key: "foerderung_tipp", 
      label: "Tipp-Box", 
      description: "Hinweis zur Förderberatung",
      fields: ["title", "subtitle", "cta_text", "cta_link"]
    },
  ],
};

const defaultData: Record<string, BlockFormData> = {
  hero: {
    title: "Gemeinsam für Kultur in Braunschweig",
    subtitle: "Der Kulturrat Braunschweig vernetzt Kulturschaffende, fördert den Austausch und stärkt die kulturelle Vielfalt unserer Stadt.",
    content: "",
    image_url: "",
    cta_text: "Mehr erfahren",
    cta_link: "/ueber-uns",
  },
  ueberuns_hero: {
    title: "Über den Kulturrat",
    subtitle: "Der Kulturrat Braunschweig ist die Interessenvertretung der Kulturschaffenden in Braunschweig. Wir vernetzen, beraten und setzen uns für die Belange der lokalen Kulturszene ein.",
    content: "",
    image_url: "",
    cta_text: "",
    cta_link: "",
  },
  ueberuns_mission: {
    title: "Unsere Mission",
    subtitle: "",
    content: "Wir stärken die kulturelle Vielfalt in Braunschweig, indem wir Kulturschaffende vernetzen, ihre Interessen vertreten und Ressourcen bündeln. Als unabhängige Stimme der Kulturszene setzen wir uns bei Politik und Verwaltung für bessere Rahmenbedingungen für Kunst und Kultur ein.",
    image_url: "",
    cta_text: "",
    cta_link: "",
  },
  kalender_hero: {
    title: "Veranstaltungskalender",
    subtitle: "Alle wichtigen Termine: Sitzungen, Workshops, Netzwerktreffen und Förderfristen auf einen Blick.",
    content: "",
    image_url: "",
    cta_text: "",
    cta_link: "",
  },
  foerderung_hero: {
    title: "Förderinfos",
    subtitle: "Förderprogramme, Stipendien und Ausschreibungen für Kulturschaffende – übersichtlich aufbereitet mit Fristen und Tipps.",
    content: "",
    image_url: "",
    cta_text: "",
    cta_link: "",
  },
  foerderung_tipp: {
    title: "Tipp",
    subtitle: "Brauchst du Hilfe beim Schreiben von Förderanträgen? Wir bieten kostenlose Beratung an!",
    content: "",
    image_url: "",
    cta_text: "Kontaktiere uns",
    cta_link: "/kontakt",
  },
};

export function CMSEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [cmsContent, setCmsContent] = useState<Record<string, CMSContent>>({});
  const [formData, setFormData] = useState<Record<string, BlockFormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchCMSContent();
  }, []);

  async function fetchCMSContent() {
    try {
      const { data, error } = await supabase
        .from("cms_content")
        .select("*");

      if (error) throw error;

      const contentMap: Record<string, CMSContent> = {};
      const formDataMap: Record<string, BlockFormData> = {};

      // Initialize with defaults
      Object.keys(defaultData).forEach(key => {
        formDataMap[key] = { ...defaultData[key] };
      });

      // Override with DB values
      if (data) {
        data.forEach((item) => {
          contentMap[item.block_key] = item;
          formDataMap[item.block_key] = {
            title: item.title || defaultData[item.block_key]?.title || "",
            subtitle: item.subtitle || defaultData[item.block_key]?.subtitle || "",
            content: item.content || defaultData[item.block_key]?.content || "",
            image_url: item.image_url || defaultData[item.block_key]?.image_url || "",
            cta_text: item.cta_text || defaultData[item.block_key]?.cta_text || "",
            cta_link: item.cta_link || defaultData[item.block_key]?.cta_link || "",
          };
        });
      }

      setCmsContent(contentMap);
      setFormData(formDataMap);
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

  function handleInputChange(blockKey: string, field: keyof BlockFormData, value: string) {
    setFormData(prev => ({
      ...prev,
      [blockKey]: { ...prev[blockKey], [field]: value }
    }));
    setHasChanges(true);
  }

  async function handleImageUpload(blockKey: string, file: File) {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Fehler",
        description: "Bitte wähle eine Bilddatei aus.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fehler",
        description: "Das Bild darf maximal 5MB groß sein.",
        variant: "destructive",
      });
      return;
    }

    setUploadingFor(blockKey);
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${blockKey}-${Date.now()}.${fileExt}`;
      const filePath = `heroes/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('cms-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cms-images')
        .getPublicUrl(filePath);

      // Update form data
      handleInputChange(blockKey, 'image_url', publicUrl);

      toast({
        title: "Hochgeladen",
        description: "Das Bild wurde erfolgreich hochgeladen.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Fehler",
        description: "Bild konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    } finally {
      setUploadingFor(null);
    }
  }

  function handleRemoveImage(blockKey: string) {
    handleInputChange(blockKey, 'image_url', '');
  }

  function handleReset() {
    const formDataMap: Record<string, BlockFormData> = {};
    
    Object.keys(defaultData).forEach(key => {
      if (cmsContent[key]) {
        formDataMap[key] = {
          title: cmsContent[key].title || defaultData[key]?.title || "",
          subtitle: cmsContent[key].subtitle || defaultData[key]?.subtitle || "",
          content: cmsContent[key].content || defaultData[key]?.content || "",
          image_url: cmsContent[key].image_url || defaultData[key]?.image_url || "",
          cta_text: cmsContent[key].cta_text || defaultData[key]?.cta_text || "",
          cta_link: cmsContent[key].cta_link || defaultData[key]?.cta_link || "",
        };
      } else {
        formDataMap[key] = { ...defaultData[key] };
      }
    });
    
    setFormData(formDataMap);
    setHasChanges(false);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      // Get all block keys that need saving
      const allBlockKeys = Object.keys(formData);
      
      for (const blockKey of allBlockKeys) {
        const data = formData[blockKey];
        const updateData = {
          title: data.title,
          subtitle: data.subtitle,
          content: data.content,
          image_url: data.image_url || null,
          cta_text: data.cta_text,
          cta_link: data.cta_link,
          updated_by: user?.id,
        };

        if (cmsContent[blockKey]) {
          const { error } = await supabase
            .from("cms_content")
            .update(updateData)
            .eq("block_key", blockKey);

          if (error) throw error;
        } else {
          const { data: newData, error } = await supabase
            .from("cms_content")
            .insert({ ...updateData, block_key: blockKey })
            .select()
            .single();

          if (error) throw error;
          setCmsContent(prev => ({ ...prev, [blockKey]: newData }));
        }
      }

      setHasChanges(false);
      toast({
        title: "Gespeichert",
        description: "Alle Änderungen wurden gespeichert.",
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

  function renderImageUpload(blockKey: string) {
    const data = formData[blockKey];
    const isUploading = uploadingFor === blockKey;

    return (
      <div className="space-y-2">
        <Label>Hero-Bild</Label>
        
        {data?.image_url ? (
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img 
              src={data.image_url} 
              alt="Hero Preview" 
              className="w-full h-48 object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => handleRemoveImage(blockKey)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRefs.current[blockKey]?.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Wird hochgeladen...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Image className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Bild hochladen</p>
                <p className="text-xs text-muted-foreground">PNG, JPG oder WebP bis 5MB</p>
              </div>
            )}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={(el) => { fileInputRefs.current[blockKey] = el; }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(blockKey, file);
            e.target.value = '';
          }}
        />

        {!data?.image_url && (
          <p className="text-xs text-muted-foreground">
            Oder füge eine Bild-URL ein:
          </p>
        )}
        
        <Input
          value={data?.image_url || ''}
          onChange={(e) => handleInputChange(blockKey, 'image_url', e.target.value)}
          placeholder="https://example.com/bild.jpg"
        />
      </div>
    );
  }

  function renderBlockEditor(blockKey: string, block: { key: string; label: string; description: string; fields: string[] }) {
    const data = formData[blockKey] || defaultData[blockKey];
    if (!data) return null;

    return (
      <Card key={blockKey}>
        <CardHeader>
          <CardTitle>{block.label}</CardTitle>
          <CardDescription>{block.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {block.fields.includes("title") && (
            <div className="space-y-2">
              <Label htmlFor={`${blockKey}-title`}>Überschrift</Label>
              <Input
                id={`${blockKey}-title`}
                value={data.title}
                onChange={(e) => handleInputChange(blockKey, "title", e.target.value)}
                placeholder="Überschrift eingeben..."
              />
            </div>
          )}

          {block.fields.includes("subtitle") && (
            <div className="space-y-2">
              <Label htmlFor={`${blockKey}-subtitle`}>Untertitel / Beschreibung</Label>
              <Textarea
                id={`${blockKey}-subtitle`}
                value={data.subtitle}
                onChange={(e) => handleInputChange(blockKey, "subtitle", e.target.value)}
                placeholder="Beschreibung eingeben..."
                rows={3}
              />
            </div>
          )}

          {block.fields.includes("content") && (
            <div className="space-y-2">
              <Label htmlFor={`${blockKey}-content`}>Inhalt</Label>
              <Textarea
                id={`${blockKey}-content`}
                value={data.content}
                onChange={(e) => handleInputChange(blockKey, "content", e.target.value)}
                placeholder="Inhalt eingeben..."
                rows={5}
              />
            </div>
          )}

          {block.fields.includes("image_url") && renderImageUpload(blockKey)}

          {(block.fields.includes("cta_text") || block.fields.includes("cta_link")) && (
            <div className="grid gap-4 md:grid-cols-2">
              {block.fields.includes("cta_text") && (
                <div className="space-y-2">
                  <Label htmlFor={`${blockKey}-cta-text`}>Button-Text</Label>
                  <Input
                    id={`${blockKey}-cta-text`}
                    value={data.cta_text}
                    onChange={(e) => handleInputChange(blockKey, "cta_text", e.target.value)}
                    placeholder="z.B. Mehr erfahren"
                  />
                </div>
              )}

              {block.fields.includes("cta_link") && (
                <div className="space-y-2">
                  <Label htmlFor={`${blockKey}-cta-link`}>Button-Link</Label>
                  <Input
                    id={`${blockKey}-cta-link`}
                    value={data.cta_link}
                    onChange={(e) => handleInputChange(blockKey, "cta_link", e.target.value)}
                    placeholder="z.B. /ueber-uns"
                  />
                </div>
              )}
            </div>
          )}

          {/* Preview */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border overflow-hidden">
            <p className="text-xs text-muted-foreground mb-3">Vorschau</p>
            {data.image_url && (
              <div className="relative h-32 -mx-4 -mt-3 mb-4 overflow-hidden">
                <img 
                  src={data.image_url} 
                  alt="Preview" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-muted/90 to-transparent" />
              </div>
            )}
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              {data.title}
            </h3>
            {data.subtitle && (
              <p className="text-muted-foreground text-sm mb-2">{data.subtitle}</p>
            )}
            {data.content && (
              <p className="text-muted-foreground text-sm mb-2">{data.content}</p>
            )}
            {data.cta_text && (
              <Button size="sm" disabled className="mt-2">
                {data.cta_text} →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Startseite</span>
          </TabsTrigger>
          <TabsTrigger value="ueberuns" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Über uns</span>
          </TabsTrigger>
          <TabsTrigger value="kalender" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Kalender</span>
          </TabsTrigger>
          <TabsTrigger value="foerderung" className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            <span className="hidden sm:inline">Förderung</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-6 mt-6">
          {pageBlocks.home.map((block) => renderBlockEditor(block.key, block))}
        </TabsContent>

        <TabsContent value="ueberuns" className="space-y-6 mt-6">
          {pageBlocks.ueberuns.map((block) => renderBlockEditor(block.key, block))}
        </TabsContent>

        <TabsContent value="kalender" className="space-y-6 mt-6">
          {pageBlocks.kalender.map((block) => renderBlockEditor(block.key, block))}
        </TabsContent>

        <TabsContent value="foerderung" className="space-y-6 mt-6">
          {pageBlocks.foerderung.map((block) => renderBlockEditor(block.key, block))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
