import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { AboutEditorData, AboutValueItem, AboutDocumentItem } from "./types";

const initial: AboutEditorData = {
  hero: { badge: "Über uns", title: "", subtitle: "", image_url: "" },
  mission: { badge: "Mission", title: "", content: "", cta_text: "Mitglied werden", cta_link: "/mitmachen" },
  values: [],
  vorstand_intro: { badge: "Team", title: "Unser Vorstand", subtitle: "" },
  satzung: { title: "", content: "" },
  documents: [],
};

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

export function newId(prefix = "new"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useAboutEditorState() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [data, setData] = useState<AboutEditorData>(initial);
  const [original, setOriginal] = useState<AboutEditorData>(initial);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cms, values, docs] = await Promise.all([
        supabase.from("cms_content").select("block_key, title, subtitle, content, image_url, cta_text, cta_link, metadata")
          .in("block_key", ["ueberuns_hero", "ueberuns_mission", "ueberuns_vorstand", "ueberuns_satzung"]),
        supabase.from("about_values").select("id, title, description, icon, sort_order").order("sort_order"),
        supabase.from("about_documents").select("id, title, description, file_url, icon, sort_order").order("sort_order"),
      ]);

      const next: AboutEditorData = JSON.parse(JSON.stringify(initial));
      const cmsMap = new Map<string, (typeof cms.data extends Array<infer R> ? R : never)>();
      (cms.data ?? []).forEach((row) => cmsMap.set(row.block_key, row));

      const heroRow = cmsMap.get("ueberuns_hero");
      if (heroRow) {
        const meta = (heroRow.metadata as Record<string, unknown> | null) ?? {};
        next.hero = {
          badge: asString(meta.badge, "Über uns"),
          title: heroRow.title ?? "",
          subtitle: heroRow.subtitle ?? "",
          image_url: heroRow.image_url ?? asString(meta.image_url),
        };
      }
      const missionRow = cmsMap.get("ueberuns_mission");
      if (missionRow) {
        const meta = (missionRow.metadata as Record<string, unknown> | null) ?? {};
        next.mission = {
          badge: asString(meta.badge, "Mission"),
          title: missionRow.title ?? "",
          content: missionRow.content ?? "",
          cta_text: missionRow.cta_text ?? asString(meta.cta_text, "Mitglied werden"),
          cta_link: missionRow.cta_link ?? asString(meta.cta_link, "/mitmachen"),
        };
      }
      const vorstandRow = cmsMap.get("ueberuns_vorstand");
      if (vorstandRow) {
        const meta = (vorstandRow.metadata as Record<string, unknown> | null) ?? {};
        next.vorstand_intro = {
          badge: asString(meta.badge, "Team"),
          title: vorstandRow.title ?? "Unser Vorstand",
          subtitle: vorstandRow.subtitle ?? "",
        };
      }
      const satzungRow = cmsMap.get("ueberuns_satzung");
      if (satzungRow) {
        next.satzung = { title: satzungRow.title ?? "", content: satzungRow.content ?? "" };
      }

      next.values = (values.data ?? []).map((v): AboutValueItem => ({
        id: v.id, title: v.title, description: v.description, icon: v.icon,
      }));
      next.documents = (docs.data ?? []).map((d): AboutDocumentItem => ({
        id: d.id, title: d.title, description: d.description, file_url: d.file_url, icon: d.icon,
      }));

      setData(next);
      setOriginal(JSON.parse(JSON.stringify(next)));
      setHasChanges(false);
    } catch (e) {
      console.error(e);
      toast({ title: "Fehler", description: "Über-uns-Inhalte konnten nicht geladen werden.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  function patch<K extends keyof AboutEditorData>(key: K, value: AboutEditorData[K]) {
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
    table: "about_values" | "about_documents",
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
      await upsertCms("ueberuns_hero", {
        title: data.hero.title, subtitle: data.hero.subtitle,
        image_url: data.hero.image_url || null,
        metadata: { badge: data.hero.badge },
      });
      await upsertCms("ueberuns_mission", {
        title: data.mission.title, content: data.mission.content,
        cta_text: data.mission.cta_text || null, cta_link: data.mission.cta_link || null,
        metadata: { badge: data.mission.badge },
      });
      await upsertCms("ueberuns_vorstand", {
        title: data.vorstand_intro.title, subtitle: data.vorstand_intro.subtitle,
        metadata: { badge: data.vorstand_intro.badge },
      });
      await upsertCms("ueberuns_satzung", {
        title: data.satzung.title, content: data.satzung.content,
      });

      await syncList("about_values",
        data.values as unknown as Array<Record<string, unknown> & { id: string }>,
        original.values,
        (item, sort_order) => ({
          title: item.title, description: item.description ?? null,
          icon: item.icon ?? null, is_active: true, sort_order,
        }));
      await syncList("about_documents",
        data.documents as unknown as Array<Record<string, unknown> & { id: string }>,
        original.documents,
        (item, sort_order) => ({
          title: item.title, description: item.description ?? null,
          file_url: (item.file_url as string) || "#", icon: item.icon ?? "Download",
          is_active: true, sort_order,
        }));

      toast({ title: "Gespeichert", description: "Über-uns-Inhalte wurden aktualisiert." });
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