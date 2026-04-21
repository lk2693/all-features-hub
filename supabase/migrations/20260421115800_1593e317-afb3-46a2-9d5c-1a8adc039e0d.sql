
-- Table: mitmachen_benefits
CREATE TABLE public.mitmachen_benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mitmachen_benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active benefits" ON public.mitmachen_benefits FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all benefits" ON public.mitmachen_benefits FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert benefits" ON public.mitmachen_benefits FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update benefits" ON public.mitmachen_benefits FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete benefits" ON public.mitmachen_benefits FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_mitmachen_benefits_updated_at BEFORE UPDATE ON public.mitmachen_benefits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table: mitmachen_member_types
CREATE TABLE public.mitmachen_member_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT 'Kostenlos',
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlighted BOOLEAN NOT NULL DEFAULT false,
  cta_text TEXT NOT NULL DEFAULT 'Jetzt beitreten',
  cta_link TEXT NOT NULL DEFAULT '/kontakt',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mitmachen_member_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active member types" ON public.mitmachen_member_types FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all member types" ON public.mitmachen_member_types FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert member types" ON public.mitmachen_member_types FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update member types" ON public.mitmachen_member_types FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete member types" ON public.mitmachen_member_types FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_mitmachen_member_types_updated_at BEFORE UPDATE ON public.mitmachen_member_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table: mitmachen_steps
CREATE TABLE public.mitmachen_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mitmachen_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active steps" ON public.mitmachen_steps FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all steps" ON public.mitmachen_steps FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert steps" ON public.mitmachen_steps FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update steps" ON public.mitmachen_steps FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete steps" ON public.mitmachen_steps FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_mitmachen_steps_updated_at BEFORE UPDATE ON public.mitmachen_steps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: Benefits
INSERT INTO public.mitmachen_benefits (title, description, icon, sort_order) VALUES
  ('Stimmrecht', 'In Vollversammlungen & Abstimmungen', 'Vote', 0),
  ('Ressourcenpool', 'Technik, Räume & Know-how nutzen', 'Package', 1),
  ('Förderberatung', 'Infos & Workshops zu Anträgen', 'BookOpen', 2),
  ('Netzwerk', 'Kontakte in der Kulturszene knüpfen', 'Handshake', 3),
  ('Newsletter', 'Exklusive Infos & Updates', 'MessageSquare', 4),
  ('Arbeitsgruppen', 'In AGs aktiv mitgestalten', 'Users', 5);

-- Seed: Member Types
INSERT INTO public.mitmachen_member_types (title, price, description, features, highlighted, cta_text, cta_link, sort_order) VALUES
  ('Einzelmitglied', 'Kostenlos', 'Für freischaffende Künstler:innen und Kulturschaffende',
    '["Stimmrecht", "Newsletter", "Ressourcenpool", "Netzwerk-Events"]'::jsonb,
    false, 'Jetzt beitreten', '/kontakt', 0),
  ('Institution', 'Auf Anfrage', 'Für Kulturvereine, Theater, Galerien und Kollektive',
    '["Alle Einzelvorteile", "Erweiterter Ressourcenzugang", "AG-Mitarbeit", "Logo auf Website"]'::jsonb,
    true, 'Jetzt beitreten', '/kontakt', 1);

-- Seed: Steps
INSERT INTO public.mitmachen_steps (title, description, sort_order) VALUES
  ('Kontakt aufnehmen', 'Schreib uns über das Kontaktformular oder per E-Mail.', 0),
  ('Antrag ausfüllen', 'Wir senden dir den Mitgliedsantrag zu.', 1),
  ('Willkommen!', 'Nach Bestätigung bist du offiziell Mitglied.', 2);

-- Seed: CMS-Blöcke für Mitmachen
INSERT INTO public.cms_content (block_key, title, subtitle, content, cta_text, cta_link, metadata) VALUES
  ('mitmachen_hero', 'Werde Teil der Kulturszene', 'Vernetze dich, bring dich ein und gestalte die Kulturpolitik unserer Stadt mit.', NULL, 'Jetzt Mitglied werden', '/kontakt',
    '{"badge": "Mitmachen", "image_url": "", "secondary_cta_text": "Arbeitsgruppen entdecken", "secondary_cta_link": "#ags"}'::jsonb),
  ('mitmachen_benefits_intro', 'Deine Vorteile als Mitglied', 'Die Mitgliedschaft steht allen Kulturschaffenden, Künstler:innen und Kulturinstitutionen offen.', NULL, NULL, NULL, '{}'::jsonb),
  ('mitmachen_steps_intro', 'So wirst du Mitglied', 'In drei einfachen Schritten', NULL, NULL, NULL, '{}'::jsonb),
  ('mitmachen_ags_intro', 'Arbeitsgruppen', 'In unseren AGs kannst du aktiv an der Arbeit des Kulturrats mitwirken.', NULL, NULL, NULL, '{}'::jsonb),
  ('mitmachen_cta', 'Fragen? Wir helfen gerne!', NULL, 'Du hast Fragen zur Mitgliedschaft oder möchtest mehr über unsere Arbeit erfahren? Kontaktiere uns – wir freuen uns auf dich!', 'Kontakt aufnehmen', '/kontakt',
    '{"secondary_cta_text": "info@kulturrat-braunschweig.de", "secondary_cta_link": "mailto:info@kulturrat-braunschweig.de"}'::jsonb)
ON CONFLICT (block_key) DO NOTHING;
