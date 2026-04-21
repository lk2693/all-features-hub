import { useMemo, useState } from "react";
import { Loader2, Save, RotateCcw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/iconMap";
import { useMitmachenEditorState } from "./useMitmachenEditorState";
import { mitmachenSectionMeta, type MitmachenSectionKey } from "./types";
import { MitmachenHeroEditor } from "./sections/MitmachenHeroEditor";
import { MitmachenBenefitsEditor } from "./sections/MitmachenBenefitsEditor";
import { MitmachenMemberTypesEditor } from "./sections/MitmachenMemberTypesEditor";
import { MitmachenStepsEditor } from "./sections/MitmachenStepsEditor";
import { MitmachenAgsIntroEditor } from "./sections/MitmachenAgsIntroEditor";
import { MitmachenCTAEditor } from "./sections/MitmachenCTAEditor";
import Mitmachen from "@/pages/Mitmachen";

const sectionOrder: MitmachenSectionKey[] = ["hero", "benefits", "member_types", "steps", "ags", "cta"];

export function MitmachenEditor() {
  const { data, patch, save, reset, isLoading, isSaving, hasChanges } = useMitmachenEditorState();
  const [active, setActive] = useState<MitmachenSectionKey>("hero");
  const [showPreview, setShowPreview] = useState(true);

  const editor = useMemo(() => {
    switch (active) {
      case "hero": return <MitmachenHeroEditor value={data.hero} onChange={(v) => patch("hero", v)} />;
      case "benefits": return <MitmachenBenefitsEditor intro={data.benefits_intro} items={data.benefits} onIntroChange={(v) => patch("benefits_intro", v)} onItemsChange={(v) => patch("benefits", v)} />;
      case "member_types": return <MitmachenMemberTypesEditor items={data.member_types} onChange={(v) => patch("member_types", v)} />;
      case "steps": return <MitmachenStepsEditor intro={data.steps_intro} items={data.steps} onIntroChange={(v) => patch("steps_intro", v)} onItemsChange={(v) => patch("steps", v)} />;
      case "ags": return <MitmachenAgsIntroEditor value={data.ags_intro} onChange={(v) => patch("ags_intro", v)} />;
      case "cta": return <MitmachenCTAEditor value={data.cta} onChange={(v) => patch("cta", v)} />;
    }
  }, [active, data, patch]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[220px,minmax(0,1fr)] xl:grid-cols-[220px,minmax(0,520px),minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-4 lg:self-start space-y-3">
        <div className="rounded-lg border bg-card p-2">
          <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sektionen</p>
          <nav className="space-y-0.5">
            {sectionOrder.map((key) => {
              const meta = mitmachenSectionMeta[key];
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

      <section className="min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{mitmachenSectionMeta[active].label}</h3>
            <p className="text-sm text-muted-foreground">{mitmachenSectionMeta[active].description}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowPreview((s) => !s)} className="hidden xl:inline-flex">
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            Vorschau
          </Button>
        </div>
        {editor}
      </section>

      {showPreview && (
        <aside className="hidden xl:block">
          <div className="sticky top-4 rounded-xl border bg-muted/30 overflow-hidden">
            <div className="px-4 py-2 border-b bg-card flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live-Vorschau</p>
              <span className="text-[10px] text-muted-foreground">verkleinert</span>
            </div>
            <ScrollArea className="h-[calc(100vh-160px)]">
              <div className="origin-top-left scale-[0.5] w-[200%] h-[200%] pointer-events-none select-none">
                <Mitmachen previewData={{
                  hero: data.hero,
                  benefits_intro: data.benefits_intro,
                  benefits: data.benefits,
                  member_types: data.member_types,
                  steps_intro: data.steps_intro,
                  steps: data.steps,
                  ags_intro: data.ags_intro,
                  cta: data.cta,
                }} />
              </div>
            </ScrollArea>
          </div>
        </aside>
      )}
    </div>
  );
}