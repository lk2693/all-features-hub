
-- Table: about_values (Leitbild items)
CREATE TABLE public.about_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.about_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active values" ON public.about_values
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all values" ON public.about_values
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert values" ON public.about_values
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update values" ON public.about_values
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete values" ON public.about_values
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_about_values_updated_at
  BEFORE UPDATE ON public.about_values
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table: about_documents (Satzung, Geschäftsordnung etc.)
CREATE TABLE public.about_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL DEFAULT '#',
  icon TEXT DEFAULT 'Download',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.about_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active documents" ON public.about_documents
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all documents" ON public.about_documents
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert documents" ON public.about_documents
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update documents" ON public.about_documents
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete documents" ON public.about_documents
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_about_documents_updated_at
  BEFORE UPDATE ON public.about_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: Leitbild
INSERT INTO public.about_values (title, description, icon, sort_order) VALUES
  ('Kultur ist unverzichtbar', 'Kultur ist ein unverzichtbarer Teil unserer Gesellschaft', 'Heart', 0),
  ('Vielfalt & Inklusion', 'Vielfalt und Inklusion prägen unser Handeln', 'Users2', 1),
  ('Transparenz & Partizipation', 'Transparenz und Partizipation sind unsere Grundprinzipien', 'Eye', 2),
  ('Kooperation', 'Kooperation geht vor Konkurrenz', 'Handshake', 3);

-- Seed: Dokumente
INSERT INTO public.about_documents (title, description, file_url, icon, sort_order) VALUES
  ('Satzung (PDF)', 'Vereinssatzung des Kulturrat Braunschweig e.V.', '#', 'Download', 0),
  ('Geschäftsordnung (PDF)', 'Regelt die interne Arbeitsweise', '#', 'Download', 1);

-- Seed: CMS-Blöcke für Über uns
INSERT INTO public.cms_content (block_key, title, subtitle, content, metadata) VALUES
  ('ueberuns_hero', 'Wir gestalten Kultur in Braunschweig', 'Der Kulturrat Braunschweig vernetzt, fördert und stärkt die Kulturszene unserer Stadt.', NULL, '{"badge": "Über uns", "image_url": ""}'::jsonb),
  ('ueberuns_mission', 'Unsere Mission', NULL, 'Wir setzen uns für eine vielfältige, lebendige und zugängliche Kulturlandschaft in Braunschweig ein. Als unabhängige Stimme der Kulturschaffenden vertreten wir die Interessen unserer Mitglieder gegenüber Politik und Verwaltung.', '{"badge": "Mission", "cta_text": "Mitglied werden", "cta_link": "/mitmachen"}'::jsonb),
  ('ueberuns_vorstand', 'Unser Vorstand', 'Ehrenamtlich engagiert für die Kulturszene Braunschweigs.', NULL, '{"badge": "Team"}'::jsonb),
  ('ueberuns_satzung', 'Satzung & Geschäftsordnung', NULL, 'Die Satzung und Geschäftsordnung des Kulturrat Braunschweig e.V. regeln unsere Arbeitsweise und Entscheidungsprozesse.', '{}'::jsonb)
ON CONFLICT (block_key) DO NOTHING;
