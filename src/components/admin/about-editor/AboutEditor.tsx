import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Save, RotateCcw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/iconMap";
import { useAboutEditorState } from "./useAboutEditorState";
import { aboutSectionMeta, type AboutSectionKey } from "./types";
import { AboutHeroEditor } from "./sections/AboutHeroEditor";
import { AboutMissionEditor } from "./sections/AboutMissionEditor";
import { AboutValuesEditor } from "./sections/AboutValuesEditor";
import { AboutVorstandIntroEditor } from "./sections/AboutVorstandIntroEditor";
import { AboutSatzungEditor } from "./sections/AboutSatzungEditor";
import { AboutDocumentsEditor } from "./sections/AboutDocumentsEditor";
import UeberUns from "@/pages/UeberUns";

const sectionOrder: AboutSectionKey[] = ["hero", "mission", "values", "vorstand", "satzung", "documents"];

const sectionAnchors: Record<AboutSectionKey, string> = {
  hero: "section",
  mission: "leitbild",
  values: "leitbild",
  vorstand: "vorstand",
  satzung: "satzung",
  documents: "satzung",
};

export function AboutEditor() {
  const { data, patch, save, reset, isLoading, isSaving, hasChanges } = useAboutEditorState();
  const [active, setActive] = useState<AboutSectionKey>("hero");
  const [showPreview, setShowPreview] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  // Scroll preview to active section's anchor.
  useEffect(() => {
    const id = sectionAnchors[active];
    const root = previewRef.current;
    if (!root) return;
    const el = id === "section" ? root.querySelector("section") : root.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  const editor = useMemo(() => {
    switch (active) {
      case "hero": return <AboutHeroEditor value={data.hero} onChange={(v) => patch("hero", v)} />;
      case "mission": return <AboutMissionEditor value={data.mission} onChange={(v) => patch("mission", v)} />;
      case "values": return <AboutValuesEditor items={data.values} onChange={(v) => patch("values", v)} />;
      case "vorstand": return <AboutVorstandIntroEditor value={data.vorstand_intro} onChange={(v) => patch("vorstand_intro", v)} />;
      case "satzung": return <AboutSatzungEditor value={data.satzung} onChange={(v) => patch("satzung", v)} />;
      case "documents": return <AboutDocumentsEditor items={data.documents} onChange={(v) => patch("documents", v)} />;
    }
  }, [active, data, patch]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[220px,minmax(0,1fr)] xl:grid-cols-[220px,minmax(0,520px),minmax(0,1fr)]">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-4 lg:self-start space-y-3">
        <div className="rounded-lg border bg-card p-2">
          <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sektionen</p>
          <nav className="space-y-0.5">
            {sectionOrder.map((key) => {
              const meta = aboutSectionMeta[key];
              const Icon = getIcon(meta.icon);
              const isActive = key === active;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActive(key)}
                  className={cn(
                    "w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{meta.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="rounded-lg border bg-card p-3 space-y-2">
          <Button onClick={save} disabled={!hasChanges || isSaving} className="w-full">
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Speichern
          </Button>
          <Button onClick={reset} disabled={!hasChanges || isSaving} variant="outline" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" /> Zurücksetzen
          </Button>
          <Button onClick={() => setShowPreview((s) => !s)} variant="ghost" size="sm" className="w-full xl:hidden">
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            Vorschau {showPreview ? "verbergen" : "zeigen"}
          </Button>
          {hasChanges && <p className="text-xs text-warning">Ungespeicherte Änderungen</p>}
        </div>
      </aside>

      {/* Editor */}
      <section className="min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{aboutSectionMeta[active].label}</h3>
            <p className="text-sm text-muted-foreground">{aboutSectionMeta[active].description}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowPreview((s) => !s)} className="hidden xl:inline-flex">
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            Vorschau
          </Button>
        </div>
        {editor}
      </section>

      {/* Live Preview */}
      {showPreview && (
        <aside className="hidden xl:block">
          <div className="sticky top-4 rounded-xl border bg-muted/30 overflow-hidden">
            <div className="px-4 py-2 border-b bg-card flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live-Vorschau</p>
              <span className="text-[10px] text-muted-foreground">verkleinert</span>
            </div>
            <ScrollArea className="h-[calc(100vh-160px)]">
              <div ref={previewRef} className="origin-top-left scale-[0.5] w-[200%] h-[200%] pointer-events-none select-none">
                <UeberUns previewData={{
                  hero: data.hero,
                  mission: data.mission,
                  values: data.values,
                  vorstand_intro: data.vorstand_intro,
                  satzung: data.satzung,
                  documents: data.documents,
                }} />
              </div>
            </ScrollArea>
          </div>
        </aside>
      )}
    </div>
  );
}