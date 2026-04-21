import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Save, RotateCcw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/iconMap";
import { useHomeEditorState } from "./useHomeEditorState";
import { sectionMeta, type SectionKey } from "./types";
import { HeroEditor } from "./sections/HeroEditor";
import { StatsEditor } from "./sections/StatsEditor";
import { FeaturesEditor } from "./sections/FeaturesEditor";
import { IntroEditor } from "./sections/IntroEditor";
import { WorkingGroupsEditor } from "./sections/WorkingGroupsEditor";
import { MembershipEditor } from "./sections/MembershipEditor";
import { CTAEditor } from "./sections/CTAEditor";

import ExpandingHero from "@/components/home/ExpandingHero";
import StatsCounter from "@/components/home/StatsCounter";
import FeaturesSection from "@/components/home/FeaturesSection";
import NewsSection from "@/components/home/NewsSection";
import WorkingGroupsSection from "@/components/home/WorkingGroupsSection";
import CalendarPreview from "@/components/home/CalendarPreview";
import ResourcesPreview from "@/components/home/ResourcesPreview";
import MembershipSection from "@/components/home/MembershipSection";
import CTASection from "@/components/home/CTASection";

const sectionOrder: SectionKey[] = [
  "hero", "stats", "features", "news", "working_groups", "calendar", "resources", "membership", "cta",
];

export function HomeEditor() {
  const { data, patch, save, reset, isLoading, isSaving, hasChanges } = useHomeEditorState();
  const [active, setActive] = useState<SectionKey>("hero");
  const [showPreview, setShowPreview] = useState(true);
  const sectionRefs = useRef<Record<SectionKey, HTMLDivElement | null>>({} as Record<SectionKey, HTMLDivElement | null>);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  // Scroll preview to active section.
  useEffect(() => {
    const el = sectionRefs.current[active];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  const editor = useMemo(() => {
    switch (active) {
      case "hero":
        return <HeroEditor value={data.hero} onChange={(v) => patch("hero", v)} />;
      case "stats":
        return <StatsEditor intro={data.stats_intro} items={data.stats}
          onIntroChange={(v) => patch("stats_intro", v)}
          onItemsChange={(v) => patch("stats", v)} />;
      case "features":
        return <FeaturesEditor intro={data.features_intro} items={data.features}
          onIntroChange={(v) => patch("features_intro", v)}
          onItemsChange={(v) => patch("features", v)} />;
      case "news":
        return <IntroEditor title="News-Vorschau – Intro" description="Titel & Untertitel über den Artikel-Karten." value={data.news_intro} onChange={(v) => patch("news_intro", v)} />;
      case "working_groups":
        return <WorkingGroupsEditor intro={data.working_groups_intro} items={data.working_groups}
          onIntroChange={(v) => patch("working_groups_intro", v)}
          onItemsChange={(v) => patch("working_groups", v)} />;
      case "calendar":
        return <IntroEditor title="Kalender-Vorschau – Intro" description="Titel & Untertitel über den Terminen." value={data.calendar_intro} onChange={(v) => patch("calendar_intro", v)} />;
      case "resources":
        return <IntroEditor title="Ressourcen-Vorschau – Intro" description="Titel & Untertitel über dem Pool." value={data.resources_intro} onChange={(v) => patch("resources_intro", v)} />;
      case "membership":
        return <MembershipEditor value={data.membership} onChange={(v) => patch("membership", v)} />;
      case "cta":
        return <CTAEditor value={data.cta} onChange={(v) => patch("cta", v)} />;
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
              const meta = sectionMeta[key];
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
            <h3 className="text-xl font-bold">{sectionMeta[active].label}</h3>
            <p className="text-sm text-muted-foreground">{sectionMeta[active].description}</p>
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
              <div ref={previewScrollRef} className="origin-top-left scale-[0.5] w-[200%] h-[200%]">
                <PreviewCanvas data={data} sectionRefs={sectionRefs} />
              </div>
            </ScrollArea>
          </div>
        </aside>
      )}
    </div>
  );
}

function PreviewCanvas({
  data,
  sectionRefs,
}: {
  data: ReturnType<typeof useHomeEditorState>["data"];
  sectionRefs: React.MutableRefObject<Record<SectionKey, HTMLDivElement | null>>;
}) {
  return (
    <div className="bg-background pointer-events-none select-none">
      <div ref={(el) => (sectionRefs.current.hero = el)}>
        <ExpandingHero previewData={{ title: data.hero.title, subtitle: data.hero.subtitle, media: data.hero.media }} />
      </div>
      <div ref={(el) => (sectionRefs.current.stats = el)}>
        <StatsCounter previewData={{ intro: { title: data.stats_intro.title, subtitle: data.stats_intro.subtitle }, items: data.stats }} />
      </div>
      <div ref={(el) => (sectionRefs.current.features = el)}>
        <FeaturesSection previewData={{
          intro: { title: data.features_intro.title, subtitle: data.features_intro.subtitle, cta_text: data.features_intro.cta_text, cta_link: data.features_intro.cta_link },
          items: data.features,
        }} />
      </div>
      <div ref={(el) => (sectionRefs.current.news = el)}>
        <NewsSection previewData={{ intro: { title: data.news_intro.title, subtitle: data.news_intro.subtitle } }} />
      </div>
      <div ref={(el) => (sectionRefs.current.working_groups = el)}>
        <WorkingGroupsSection previewData={{
          intro: { title: data.working_groups_intro.title, subtitle: data.working_groups_intro.subtitle, cta_text: data.working_groups_intro.cta_text, cta_link: data.working_groups_intro.cta_link },
          items: data.working_groups,
        }} />
      </div>
      <div ref={(el) => (sectionRefs.current.calendar = el)}>
        <CalendarPreview previewData={{ intro: { title: data.calendar_intro.title, subtitle: data.calendar_intro.subtitle } }} />
      </div>
      <div ref={(el) => (sectionRefs.current.resources = el)}>
        <ResourcesPreview previewData={{ intro: { title: data.resources_intro.title, subtitle: data.resources_intro.subtitle } }} />
      </div>
      <div ref={(el) => (sectionRefs.current.membership = el)}>
        <MembershipSection previewData={{
          title: data.membership.title, subtitle: data.membership.subtitle, content: data.membership.content,
          image_url: data.membership.image_url, quote_author: data.membership.quote_author, benefits: data.membership.benefits,
        }} />
      </div>
      <div ref={(el) => (sectionRefs.current.cta = el)}>
        <CTASection previewData={{
          title: data.cta.title, subtitle: data.cta.subtitle, content: data.cta.content, image_url: data.cta.image_url,
          primary_cta_text: data.cta.primary_cta_text, primary_cta_link: data.cta.primary_cta_link,
          secondary_cta_text: data.cta.secondary_cta_text, secondary_cta_link: data.cta.secondary_cta_link,
          footer_note: data.cta.footer_note,
        }} />
      </div>
    </div>
  );
}