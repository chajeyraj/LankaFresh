
-- Fix customers INSERT policy
DROP POLICY IF EXISTS "Anyone can insert customers" ON public.customers;
CREATE POLICY "Anyone can insert customers"
ON public.customers
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Fix orders INSERT policy
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders"
ON public.orders
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Fix order_items INSERT policy
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items"
ON public.order_items
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Fix contact_messages INSERT policy
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can insert contact messages"
ON public.contact_messages
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
