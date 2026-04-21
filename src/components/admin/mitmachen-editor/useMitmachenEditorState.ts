import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type {
  MitmachenEditorData, MitmachenBenefit, MitmachenMemberType, MitmachenStep,
} from "./types";

const initial: MitmachenEditorData = {
  hero: {
    badge: "Mitmachen", title: "", subtitle: "", image_url: "",
    cta_text: "Jetzt Mitglied werden", cta_link: "/kontakt",
    secondary_cta_text: "Arbeitsgruppen entdecken", secondary_cta_link: "#ags",
  },
  benefits_intro: { title: "", subtitle: "" },
  benefits: [],
  member_types: [],
  steps_intro: { title: "", subtitle: "" },
  steps: [],
  ags_intro: { title: "", subtitle: "" },
  cta: {
    title: "", content: "",
    cta_text: "Kontakt aufnehmen", cta_link: "/kontakt",
    secondary_cta_text: "", secondary_cta_link: "",
  },
};

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export function newId(prefix = "new"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useMitmachenEditorState() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [data, setData] = useState<MitmachenEditorData>(initial);
  const [original, setOriginal] = useState<MitmachenEditorData>(initial);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cms, benefits, types, steps] = await Promise.all([
        supabase.from("cms_content").select("block_key, title, subtitle, content, image_url, cta_text, cta_link, metadata")
          .in("block_key", ["mitmachen_hero", "mitmachen_benefits_intro", "mitmachen_steps_intro", "mitmachen_ags_intro", "mitmachen_cta"]),
        supabase.from("mitmachen_benefits").select("id, title, description, icon, sort_order").order("sort_order"),
        supabase.from("mitmachen_member_types").select("id, title, price, description, features, highlighted, cta_text, cta_link, sort_order").order("sort_order"),
        supabase.from("mitmachen_steps").select("id, title, description, sort_order").order("sort_order"),
      ]);

      const next: MitmachenEditorData = JSON.parse(JSON.stringify(initial));
      const cmsMap = new Map<string, (typeof cms.data extends Array<infer R> ? R : never)>();
      (cms.data ?? []).forEach((row) => cmsMap.set(row.block_key, row));

      const heroRow = cmsMap.get("mitmachen_hero");
      if (heroRow) {
        const meta = (heroRow.metadata as Record<string, unknown> | null) ?? {};
        next.hero = {
          badge: asString(meta.badge, "Mitmachen"),
          title: heroRow.title ?? "",
          subtitle: heroRow.subtitle ?? "",
          image_url: heroRow.image_url ?? asString(meta.image_url),
          cta_text: heroRow.cta_text ?? "Jetzt Mitglied werden",
          cta_link: heroRow.cta_link ?? "/kontakt",
          secondary_cta_text: asString(meta.secondary_cta_text, "Arbeitsgruppen entdecken"),
          secondary_cta_link: asString(meta.secondary_cta_link, "#ags"),
        };
      }

      const introRows: Array<["benefits_intro" | "steps_intro" | "ags_intro", string]> = [
        ["benefits_intro", "mitmachen_benefits_intro"],
        ["steps_intro", "mitmachen_steps_intro"],
        ["ags_intro", "mitmachen_ags_intro"],
      ];
      introRows.forEach(([key, blockKey]) => {
        const row = cmsMap.get(blockKey);
        if (row) next[key] = { title: row.title ?? "", subtitle: row.subtitle ?? "" };
      });

      const ctaRow = cmsMap.get("mitmachen_cta");
      if (ctaRow) {
        const meta = (ctaRow.metadata as Record<string, unknown> | null) ?? {};
        next.cta = {
          title: ctaRow.title ?? "",
          content: ctaRow.content ?? "",
          cta_text: ctaRow.cta_text ?? "Kontakt aufnehmen",
          cta_link: ctaRow.cta_link ?? "/kontakt",
          secondary_cta_text: asString(meta.secondary_cta_text),
          secondary_cta_link: asString(meta.secondary_cta_link),
        };
      }

      next.benefits = (benefits.data ?? []).map((b): MitmachenBenefit => ({
        id: b.id, title: b.title, description: b.description, icon: b.icon,
      }));
      next.member_types = (types.data ?? []).map((t): MitmachenMemberType => ({
        id: t.id, title: t.title, price: t.price, description: t.description,
        features: asArray<string>(t.features), highlighted: !!t.highlighted,
        cta_text: t.cta_text, cta_link: t.cta_link,
      }));
      next.steps = (steps.data ?? []).map((s): MitmachenStep => ({
        id: s.id, title: s.title, description: s.description,
      }));

      setData(next);
      setOriginal(JSON.parse(JSON.stringify(next)));
      setHasChanges(false);
    } catch (e) {
      console.error(e);
      toast({ title: "Fehler", description: "Mitmachen-Inhalte konnten nicht geladen werden.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  function patch<K extends keyof MitmachenEditorData>(key: K, value: MitmachenEditorData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setHasChanges(true);
  }

  function reset() {
    setData(JSON.parse(JSON.stringify(original)));
    setHasChanges(false);
  }

  async function upsertCms(block_key: string, payload: Record<string, unknown>) {
    const body = { ...payload, block_key, updated_by: user?.id };
    const { data: existing } = await supabase
      .from("cms_content").select("id").eq("block_key", block_key).maybeSingle();
    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from("cms_content").update(body as any).eq("block_key", block_key);
      if (error) throw error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from("cms_content").insert(body as any);
      if (error) throw error;
    }
  }

  async function syncList(
    table: "mitmachen_benefits" | "mitmachen_member_types" | "mitmachen_steps",
    items: Array<Record<string, unknown> & { id: string }>,
    originalItems: Array<{ id: string }>,
    buildPayload: (item: Record<string, unknown>, sort_order: number) => Record<string, unknown>,
  ) {
    const originalIds = new Set(originalItems.map((i) => i.id));
    const currentIds = new Set(items.map((i) => i.id));
    const toDelete = [...originalIds].filter((id) => !currentIds.has(id));
    if (toDelete.length > 0) {
      const { error } = await supabase.from(table).delete().in("id", toDelete);
      if (error) throw error;
    }
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
      await upsertCms("mitmachen_hero", {
        title: data.hero.title, subtitle: data.hero.subtitle,
        image_url: data.hero.image_url || null,
        cta_text: data.hero.cta_text || null, cta_link: data.hero.cta_link || null,
        metadata: {
          badge: data.hero.badge,
          secondary_cta_text: data.hero.secondary_cta_text,
          secondary_cta_link: data.hero.secondary_cta_link,
        },
      });
      await upsertCms("mitmachen_benefits_intro", { title: data.benefits_intro.title, subtitle: data.benefits_intro.subtitle });
      await upsertCms("mitmachen_steps_intro", { title: data.steps_intro.title, subtitle: data.steps_intro.subtitle });
      await upsertCms("mitmachen_ags_intro", { title: data.ags_intro.title, subtitle: data.ags_intro.subtitle });
      await upsertCms("mitmachen_cta", {
        title: data.cta.title, content: data.cta.content,
        cta_text: data.cta.cta_text || null, cta_link: data.cta.cta_link || null,
        metadata: {
          secondary_cta_text: data.cta.secondary_cta_text,
          secondary_cta_link: data.cta.secondary_cta_link,
        },
      });

      await syncList("mitmachen_benefits",
        data.benefits as unknown as Array<Record<string, unknown> & { id: string }>,
        original.benefits,
        (item, sort_order) => ({
          title: item.title, description: item.description ?? null,
          icon: item.icon ?? null, is_active: true, sort_order,
        }));
      await syncList("mitmachen_member_types",
        data.member_types as unknown as Array<Record<string, unknown> & { id: string }>,
        original.member_types,
        (item, sort_order) => ({
          title: item.title, price: item.price, description: item.description ?? null,
          features: Array.isArray(item.features) ? item.features : [],
          highlighted: !!item.highlighted,
          cta_text: item.cta_text || "Jetzt beitreten",
          cta_link: item.cta_link || "/kontakt",
          is_active: true, sort_order,
        }));
      await syncList("mitmachen_steps",
        data.steps as unknown as Array<Record<string, unknown> & { id: string }>,
        original.steps,
        (item, sort_order) => ({
          title: item.title, description: item.description ?? null,
          is_active: true, sort_order,
        }));

      toast({ title: "Gespeichert", description: "Mitmachen-Inhalte wurden aktualisiert." });
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