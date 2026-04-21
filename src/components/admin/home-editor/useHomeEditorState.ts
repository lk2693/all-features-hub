import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { HomeEditorData, IntroData, HeroMediaItem } from "./types";
import type { StatItem } from "@/components/home/StatsCounter";
import type { FeatureItem } from "@/components/home/FeaturesSection";
import type { WorkingGroupItem } from "@/components/home/WorkingGroupsSection";
import type { BenefitItem } from "@/components/home/MembershipSection";

const emptyIntro: IntroData = { title: "", subtitle: "", cta_text: "", cta_link: "" };

const initial: HomeEditorData = {
  hero: { title: "", subtitle: "", media: [] },
  stats_intro: { ...emptyIntro },
  stats: [],
  features_intro: { ...emptyIntro },
  features: [],
  news_intro: { ...emptyIntro },
  working_groups_intro: { ...emptyIntro },
  working_groups: [],
  calendar_intro: { ...emptyIntro },
  resources_intro: { ...emptyIntro },
  membership: { title: "", subtitle: "", content: "", image_url: "", quote_author: "", benefits: [] },
  cta: {
    title: "", subtitle: "", content: "", image_url: "",
    primary_cta_text: "", primary_cta_link: "",
    secondary_cta_text: "", secondary_cta_link: "",
    footer_note: "",
  },
};

function asString(v: unknown): string { return typeof v === "string" ? v : ""; }
function asArray<T>(v: unknown): T[] { return Array.isArray(v) ? (v as T[]) : []; }

/** Manages all homepage CMS data: load, patch, save. */
export function useHomeEditorState() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [data, setData] = useState<HomeEditorData>(initial);
  const [original, setOriginal] = useState<HomeEditorData>(initial);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cms, stats, features, groups] = await Promise.all([
        supabase.from("cms_content").select("block_key, title, subtitle, content, image_url, cta_text, cta_link, metadata"),
        supabase.from("home_stats").select("id, label, value, suffix, icon, sort_order").order("sort_order"),
        supabase.from("home_features").select("id, title, subtitle, description, icon, image_url, link, sort_order").order("sort_order"),
        supabase.from("working_groups").select("id, name, description, icon, image_url, member_count, contact_email, meeting_info, sort_order").order("sort_order"),
      ]);

      const next: HomeEditorData = JSON.parse(JSON.stringify(initial));

      const cmsMap = new Map<string, typeof cms.data extends Array<infer R> ? R : never>();
      (cms.data ?? []).forEach((row) => cmsMap.set(row.block_key, row));

      const heroRow = cmsMap.get("hero");
      if (heroRow) {
        const meta = (heroRow.metadata as Record<string, unknown> | null) ?? {};
        next.hero = {
          title: heroRow.title ?? "",
          subtitle: heroRow.subtitle ?? "",
          media: asArray<HeroMediaItem>(meta.media),
        };
      }

      const introKeys: Array<["stats_intro" | "features_intro" | "news_intro" | "working_groups_intro" | "calendar_intro" | "resources_intro"]> = [
        ["stats_intro"], ["features_intro"], ["news_intro"], ["working_groups_intro"], ["calendar_intro"], ["resources_intro"],
      ];
      introKeys.forEach(([k]) => {
        const row = cmsMap.get(k);
        if (!row) return;
        const meta = (row.metadata as Record<string, unknown> | null) ?? {};
        next[k] = {
          title: row.title ?? "",
          subtitle: row.subtitle ?? "",
          cta_text: row.cta_text ?? asString(meta.cta_text) ?? "",
          cta_link: row.cta_link ?? asString(meta.cta_link) ?? "",
        };
      });

      const memRow = cmsMap.get("membership");
      if (memRow) {
        const meta = (memRow.metadata as Record<string, unknown> | null) ?? {};
        next.membership = {
          title: memRow.title ?? "",
          subtitle: memRow.subtitle ?? "",
          content: memRow.content ?? "",
          image_url: memRow.image_url ?? "",
          quote_author: asString(meta.quote_author),
          benefits: asArray<BenefitItem>(meta.benefits),
        };
      }

      const ctaRow = cmsMap.get("cta");
      if (ctaRow) {
        const meta = (ctaRow.metadata as Record<string, unknown> | null) ?? {};
        next.cta = {
          title: ctaRow.title ?? "",
          subtitle: ctaRow.subtitle ?? "",
          content: ctaRow.content ?? "",
          image_url: ctaRow.image_url ?? "",
          primary_cta_text: asString(meta.primary_cta_text),
          primary_cta_link: asString(meta.primary_cta_link),
          secondary_cta_text: asString(meta.secondary_cta_text),
          secondary_cta_link: asString(meta.secondary_cta_link),
          footer_note: asString(meta.footer_note),
        };
      }

      next.stats = (stats.data ?? []).map((s): StatItem => ({
        id: s.id, label: s.label, value: Number(s.value), suffix: s.suffix, icon: s.icon,
      }));
      next.features = (features.data ?? []).map((f): FeatureItem & { description?: string | null } => ({
        id: f.id, title: f.title, subtitle: f.subtitle, icon: f.icon, image_url: f.image_url, link: f.link,
      }));
      next.working_groups = (groups.data ?? []) as WorkingGroupItem[];

      setData(next);
      setOriginal(JSON.parse(JSON.stringify(next)));
      setHasChanges(false);
    } catch (e) {
      console.error(e);
      toast({ title: "Fehler", description: "Startseiten-Inhalte konnten nicht geladen werden.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  function patch<K extends keyof HomeEditorData>(key: K, value: HomeEditorData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setHasChanges(true);
  }

  function reset() {
    setData(JSON.parse(JSON.stringify(original)));
    setHasChanges(false);
  }

  async function upsertCms(block_key: string, payload: Record<string, unknown>) {
    const body = { ...payload, block_key, updated_by: user?.id };
    // Try update; if not exists, insert.
    const { data: existing } = await supabase
      .from("cms_content").select("id").eq("block_key", block_key).maybeSingle();
    if (existing) {
      const { error } = await supabase.from("cms_content").update(body).eq("block_key", block_key);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("cms_content").insert(body);
      if (error) throw error;
    }
  }

  async function syncList(
    table: "home_stats" | "home_features" | "working_groups",
    items: Array<Record<string, unknown> & { id: string }>,
    originalItems: Array<{ id: string }>,
    buildPayload: (item: Record<string, unknown>, sort_order: number) => Record<string, unknown>,
  ) {
    const originalIds = new Set(originalItems.map((i) => i.id));
    const currentIds = new Set(items.map((i) => i.id));
    // Deletes
    const toDelete = [...originalIds].filter((id) => !currentIds.has(id));
    if (toDelete.length > 0) {
      const { error } = await supabase.from(table).delete().in("id", toDelete);
      if (error) throw error;
    }
    // Upserts
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const payload = buildPayload(item, i);
      const isNew = !originalIds.has(item.id) || item.id.startsWith("new-");
      if (isNew) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await supabase.from(table).insert(payload as any);
        if (error) throw error;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await supabase.from(table).update(payload as any).eq("id", item.id);
        if (error) throw error;
      }
    }
  }

  async function save() {
    setIsSaving(true);
    try {
      // CMS blocks
      await upsertCms("hero", {
        title: data.hero.title, subtitle: data.hero.subtitle,
        metadata: { media: data.hero.media },
      });
      const introKeys = ["stats_intro", "features_intro", "news_intro", "working_groups_intro", "calendar_intro", "resources_intro"] as const;
      for (const k of introKeys) {
        const v = data[k];
        await upsertCms(k, {
          title: v.title, subtitle: v.subtitle,
          cta_text: v.cta_text || null, cta_link: v.cta_link || null,
        });
      }
      await upsertCms("membership", {
        title: data.membership.title, subtitle: data.membership.subtitle,
        content: data.membership.content, image_url: data.membership.image_url || null,
        metadata: { quote_author: data.membership.quote_author, benefits: data.membership.benefits },
      });
      await upsertCms("cta", {
        title: data.cta.title, subtitle: data.cta.subtitle, content: data.cta.content,
        image_url: data.cta.image_url || null,
        metadata: {
          primary_cta_text: data.cta.primary_cta_text, primary_cta_link: data.cta.primary_cta_link,
          secondary_cta_text: data.cta.secondary_cta_text, secondary_cta_link: data.cta.secondary_cta_link,
          footer_note: data.cta.footer_note,
        },
      });

      // Lists
      await syncList("home_stats", data.stats as unknown as Array<Record<string, unknown> & { id: string }>, original.stats,
        (item, sort_order) => ({
          label: item.label, value: Number(item.value) || 0, suffix: item.suffix ?? "+", icon: item.icon ?? null,
          is_active: true, sort_order,
        }));
      await syncList("home_features", data.features as unknown as Array<Record<string, unknown> & { id: string }>, original.features,
        (item, sort_order) => ({
          title: item.title, subtitle: item.subtitle ?? null,
          icon: item.icon ?? null, image_url: item.image_url ?? null,
          link: item.link || "/", is_active: true, sort_order,
        }));
      await syncList("working_groups", data.working_groups as unknown as Array<Record<string, unknown> & { id: string }>, original.working_groups,
        (item, sort_order) => ({
          name: item.name, description: item.description ?? null,
          icon: item.icon ?? null, image_url: item.image_url ?? null,
          member_count: typeof item.member_count === "number" ? item.member_count : Number(item.member_count) || 0,
          contact_email: item.contact_email ?? null, meeting_info: item.meeting_info ?? null,
          is_active: true, sort_order,
        }));

      toast({ title: "Gespeichert", description: "Startseiten-Inhalte wurden aktualisiert." });
      await loadAll();
    } catch (e) {
      console.error(e);
      toast({ title: "Fehler", description: "Speichern fehlgeschlagen.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return { data, patch, reset, save, isLoading, isSaving, hasChanges };
}

export function newId(prefix = "new"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}