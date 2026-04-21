CREATE TABLE public.theme_settings (
  id text PRIMARY KEY DEFAULT 'default',
  primary_color text NOT NULL DEFAULT '24 75% 55%',
  primary_foreground text NOT NULL DEFAULT '0 0% 100%',
  primary_glow text NOT NULL DEFAULT '24 85% 65%',
  accent text NOT NULL DEFAULT '95 30% 55%',
  accent_foreground text NOT NULL DEFAULT '0 0% 100%',
  background text NOT NULL DEFAULT '40 30% 97%',
  foreground text NOT NULL DEFAULT '20 15% 15%',
  card text NOT NULL DEFAULT '0 0% 100%',
  card_foreground text NOT NULL DEFAULT '20 15% 15%',
  muted text NOT NULL DEFAULT '40 20% 92%',
  muted_foreground text NOT NULL DEFAULT '20 10% 45%',
  border text NOT NULL DEFAULT '40 15% 88%',
  secondary text NOT NULL DEFAULT '40 20% 92%',
  secondary_foreground text NOT NULL DEFAULT '20 15% 15%',
  font_display text NOT NULL DEFAULT 'Playfair Display',
  font_body text NOT NULL DEFAULT 'Inter',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read theme"
ON public.theme_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can insert theme"
ON public.theme_settings FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update theme"
ON public.theme_settings FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_theme_settings_updated_at
BEFORE UPDATE ON public.theme_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.theme_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.theme_settings;