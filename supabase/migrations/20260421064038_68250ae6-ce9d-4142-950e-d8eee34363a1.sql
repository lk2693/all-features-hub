-- ============================================================
-- Startseiten-CMS: neue Tabellen für sortierbare Listen
-- ============================================================

-- Features-Karten ("Was wir bieten")
CREATE TABLE public.home_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  icon text,
  image_url text,
  link text NOT NULL DEFAULT '/',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.home_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active features"
  ON public.home_features FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all features"
  ON public.home_features FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert features"
  ON public.home_features FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update features"
  ON public.home_features FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete features"
  ON public.home_features FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_home_features_updated_at
  BEFORE UPDATE ON public.home_features
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Statistik-Zahlen
CREATE TABLE public.home_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  suffix text DEFAULT '+',
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.home_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active stats"
  ON public.home_stats FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all stats"
  ON public.home_stats FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert stats"
  ON public.home_stats FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update stats"
  ON public.home_stats FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete stats"
  ON public.home_stats FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_home_stats_updated_at
  BEFORE UPDATE ON public.home_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Arbeitsgruppen
CREATE TABLE public.working_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  image_url text,
  contact_email text,
  meeting_info text,
  member_count int DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.working_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active working groups"
  ON public.working_groups FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all working groups"
  ON public.working_groups FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert working groups"
  ON public.working_groups FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update working groups"
  ON public.working_groups FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete working groups"
  ON public.working_groups FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_working_groups_updated_at
  BEFORE UPDATE ON public.working_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Seed-Daten: home_features
-- ============================================================
INSERT INTO public.home_features (title, subtitle, icon, link, sort_order) VALUES
  ('News & Blog',     'Aktuelles aus der Kulturszene', 'Newspaper',     '/news',       0),
  ('Kalender',        'Events & Termine',              'CalendarDays',  '/kalender',   1),
  ('Ressourcenpool',  'Teilen & Finden',               'Package',       '/ressourcen', 2),
  ('Förderinfos',     'Stipendien & Programme',        'Coins',         '/foerderung', 3),
  ('Community',       'Vernetzen & Austauschen',       'Users',         '/mitmachen',  4),
  ('Kontakt',         'Direkter Draht',                'MessageSquare', '/kontakt',    5);

-- ============================================================
-- Seed-Daten: home_stats
-- ============================================================
INSERT INTO public.home_stats (label, value, suffix, icon, sort_order) VALUES
  ('Mitglieder',   120, '+', 'Users',    0),
  ('Events / Jahr', 50, '+', 'Calendar', 1),
  ('Ressourcen',    80, '+', 'Folder',   2);

-- ============================================================
-- Seed-Daten: working_groups
-- ============================================================
INSERT INTO public.working_groups (name, description, icon, member_count, sort_order) VALUES
  ('AG Kulturpolitik',         'Stellungnahmen & politische Vertretung', 'Target',    12, 0),
  ('AG Förderung',             'Förderinfos & Antrags-Workshops',        'FileCheck',  8, 1),
  ('AG Öffentlichkeitsarbeit', 'Website, Social Media & PR',             'Megaphone',  6, 2),
  ('AG Ressourcen',            'Ressourcenpool & neue Angebote',         'Palette',    5, 3);

-- ============================================================
-- Seed-Daten: cms_content für alle Startseiten-Sektionen
-- (nur einfügen, falls noch nicht vorhanden)
-- ============================================================
INSERT INTO public.cms_content (block_key, title, subtitle, content, metadata)
VALUES
  ('stats_intro',
   'Kulturszene in Zahlen',
   'Was wir bewegen',
   NULL,
   '{}'::jsonb),
  ('features_intro',
   'Was wir bieten',
   'Alles für Kulturschaffende in Braunschweig',
   NULL,
   '{"cta_text":"Alle Angebote","cta_link":"/mitmachen"}'::jsonb),
  ('news_intro',
   'Aktuelle News',
   'Das bewegt die Kulturszene',
   NULL,
   '{}'::jsonb),
  ('working_groups_intro',
   'Arbeitsgruppen',
   'In unseren AGs gestaltest du aktiv mit – von Kulturpolitik bis Öffentlichkeitsarbeit.',
   NULL,
   '{"cta_text":"Alle AGs","cta_link":"/mitmachen"}'::jsonb),
  ('calendar_intro',
   'Kommende Termine',
   'Veranstaltungen, Workshops & Vollversammlungen',
   NULL,
   '{}'::jsonb),
  ('resources_intro',
   'Ressourcenpool',
   'Technik, Räume und Know-how aus der Community',
   NULL,
   '{}'::jsonb),
  ('membership',
   'Mitglied werden',
   'Werde Teil des Kulturrats und gestalte die Kulturpolitik in Braunschweig aktiv mit.',
   '„Gemeinsam sind wir die Stimme der Kultur in Braunschweig."',
   '{
      "benefits": [
        {"icon":"Vote",          "title":"Stimmrecht",     "desc":"In Vollversammlungen & Abstimmungen"},
        {"icon":"Package",       "title":"Ressourcenpool", "desc":"Technik, Räume & Know-how nutzen"},
        {"icon":"BookOpen",      "title":"Förderberatung", "desc":"Infos & Workshops zu Anträgen"},
        {"icon":"Handshake",     "title":"Netzwerk",       "desc":"Kontakte in der Kulturszene knüpfen"},
        {"icon":"MessageSquare", "title":"Newsletter",     "desc":"Exklusive Infos & Updates"},
        {"icon":"Users",         "title":"Arbeitsgruppen", "desc":"In AGs aktiv mitgestalten"}
      ],
      "quote_author": "— Kulturrat Braunschweig e.V."
    }'::jsonb),
  ('cta',
   'Werde Teil der Kulturszene',
   'Jetzt mitmachen',
   'Der Kulturrat lebt vom Engagement seiner Mitglieder. Bring dich ein, vernetze dich und gestalte Kulturpolitik mit.',
   '{
      "primary_cta_text":"Mitglied werden",
      "primary_cta_link":"/mitmachen",
      "secondary_cta_text":"Kontakt aufnehmen",
      "secondary_cta_link":"/kontakt",
      "footer_note":"Kostenlose Mitgliedschaft für Einzelpersonen · Institutionen auf Anfrage"
    }'::jsonb)
ON CONFLICT DO NOTHING;