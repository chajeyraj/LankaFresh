
DROP POLICY "Anyone can insert customers" ON public.customers;

CREATE POLICY "Anyone can insert customers"
ON public.customers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
