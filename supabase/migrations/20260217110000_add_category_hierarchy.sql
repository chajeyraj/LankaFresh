ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS parent_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'categories_parent_id_fkey'
      AND conrelid = 'public.categories'::regclass
  ) THEN
    ALTER TABLE public.categories
    ADD CONSTRAINT categories_parent_id_fkey
    FOREIGN KEY (parent_id)
    REFERENCES public.categories(id)
    ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'categories_parent_not_self'
      AND conrelid = 'public.categories'::regclass
  ) THEN
    ALTER TABLE public.categories
    ADD CONSTRAINT categories_parent_not_self
    CHECK (parent_id IS NULL OR parent_id <> id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

CREATE OR REPLACE FUNCTION public.validate_category_hierarchy()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  found_cycle BOOLEAN;
BEGIN
  IF NEW.parent_id IS NULL THEN
    RETURN NEW;
  END IF;

  WITH RECURSIVE ancestry AS (
    SELECT id, parent_id
    FROM public.categories
    WHERE id = NEW.parent_id
    UNION ALL
    SELECT c.id, c.parent_id
    FROM public.categories c
    INNER JOIN ancestry a ON c.id = a.parent_id
  )
  SELECT EXISTS (SELECT 1 FROM ancestry WHERE id = NEW.id) INTO found_cycle;

  IF found_cycle THEN
    RAISE EXCEPTION 'Category hierarchy cannot contain cycles.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_category_hierarchy ON public.categories;
CREATE TRIGGER trg_validate_category_hierarchy
BEFORE INSERT OR UPDATE OF parent_id
ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.validate_category_hierarchy();
