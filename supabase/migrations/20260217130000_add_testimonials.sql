CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  avatar_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published testimonials" ON public.testimonials;
CREATE POLICY "Anyone can view published testimonials"
ON public.testimonials
FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
CREATE POLICY "Admins can insert testimonials"
ON public.testimonials
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
CREATE POLICY "Admins can update testimonials"
ON public.testimonials
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON public.testimonials(sort_order, created_at DESC);

INSERT INTO public.testimonials (name, location, rating, comment, avatar_url, is_published, sort_order)
VALUES
  ('Priya K.', 'Toronto, Canada', 5, 'The spices are incredibly fresh and authentic. Tastes just like my grandmother''s cooking!', 'https://randomuser.me/api/portraits/women/32.jpg', true, 1),
  ('Rajesh M.', 'London, UK', 5, 'Finally found a place that delivers genuine Sri Lankan products. The mango pickle is out of this world!', 'https://randomuser.me/api/portraits/men/45.jpg', true, 2),
  ('Anjali P.', 'Sydney, Australia', 5, 'Excellent customer service and the products arrived perfectly packed. Will definitely order again!', 'https://randomuser.me/api/portraits/women/68.jpg', true, 3),
  ('Kumar S.', 'New York, USA', 5, 'The tea leaves are exceptional quality. Reminds me of home. Will be a returning customer for sure!', 'https://randomuser.me/api/portraits/men/22.jpg', true, 4),
  ('Meena R.', 'Dubai, UAE', 5, 'Authentic Sri Lankan flavors delivered right to my doorstep. The packaging was excellent!', 'https://randomuser.me/api/portraits/women/44.jpg', true, 5)
ON CONFLICT DO NOTHING;
