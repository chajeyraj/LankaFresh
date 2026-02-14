
INSERT INTO public.products (category_id, name, description, price_lkr, price_usd, image_url, origin, weight_grams, cultural_significance) VALUES
-- Spices & Tea
('23072da3-add1-4749-b2de-51bb27f1fcf3', 'Ceylon Cinnamon Sticks (True Cinnamon)', 'Premium quality Ceylon cinnamon sticks, known for their delicate fragrance and sweet, warm flavour. Far superior to common Cassia varieties.', 800.00, 2.50, 'https://picsum.photos/seed/ceylon-cinnamon/400/300', 'Matale', 150, 'Ceylon cinnamon has been a prized spice for centuries and is a key export of Sri Lanka.'),
('23072da3-add1-4749-b2de-51bb27f1fcf3', 'Ceylon Silver Tips White Tea', 'A rare and prized tea made from only the unopened buds of the tea plant. Delivers a delicate, subtle flavour with notes of honey and fruit.', 3500.00, 11.00, 'https://picsum.photos/seed/ceylon-silver-tips/400/300', 'Nuwara Eliya', 100, 'Considered the champagne of teas, Silver Tips are hand-plucked at dawn and sun-dried.'),
('23072da3-add1-4749-b2de-51bb27f1fcf3', 'Sun-Dried Red Chilies', 'Whole dried red chilies from the Northern Province, known for their vibrant color and intense heat.', 750.00, 2.30, 'https://picsum.photos/seed/dried-chilies/400/300', 'Vavuniya', 200, NULL),

-- Food & Snacks
('e70c4276-2216-4892-9d52-29c512d1de9f', 'Kalu Dodol', 'A rich, dark, and sticky sweet delicacy made from coconut milk, jaggery, and rice flour, slow-cooked for hours.', 1500.00, 4.70, 'https://picsum.photos/seed/kalu-dodol/400/300', 'Hambantota', 500, 'A festive favourite, often prepared for the Sinhala and Tamil New Year.'),
('e70c4276-2216-4892-9d52-29c512d1de9f', 'Kithul Treacle', 'A dark, sweet syrup extracted from the flower of the Kithul palm. Delicious natural topping for desserts and yogurt.', 1100.00, 3.50, 'https://picsum.photos/seed/kithul-treacle/400/300', 'Ratnapura', 350, NULL),
('e70c4276-2216-4892-9d52-29c512d1de9f', 'Coconut Sambol Mix', 'Ready-to-prepare coconut sambol with dried chili flakes, Maldive fish, and lime. Just add fresh coconut.', 650.00, 2.00, 'https://picsum.photos/seed/coconut-sambol/400/300', 'Colombo', 200, NULL),

-- Handicrafts & Art
('464775cb-5c8e-47dc-94c7-e2dece502816', 'Traditional Kandyan Mask', 'A vibrant, hand-carved wooden mask representing a character from ancient Sri Lankan folklore.', 4500.00, 14.00, 'https://picsum.photos/seed/kandyan-mask/400/300', 'Ambalangoda', 700, 'These masks are an integral part of Sri Lankan cultural performances and are believed to have healing powers.'),
('464775cb-5c8e-47dc-94c7-e2dece502816', 'Batik Wall Hanging', 'Hand-dyed batik art on cotton fabric depicting Sri Lankan wildlife and landscapes.', 3200.00, 10.00, 'https://picsum.photos/seed/batik-art/400/300', 'Matale', 300, NULL),

-- Ayurvedic & Herbal
('837ef986-1075-4589-b88e-0c5e092de25a', 'Siddhalepa Ayurvedic Balm', 'A world-famous herbal balm based on Ayurvedic traditions. Provides relief from aches, pains, colds, and flu.', 600.00, 1.90, 'https://picsum.photos/seed/siddhalepa-balm/400/300', 'Colombo', 50, 'Siddhalepa represents Sri Lanka''s rich heritage of indigenous medicine and natural healing.'),
('837ef986-1075-4589-b88e-0c5e092de25a', 'King Coconut Oil (Cold Pressed)', 'Pure cold-pressed king coconut oil for skin, hair and cooking. Rich in nutrients and antioxidants.', 1800.00, 5.60, 'https://picsum.photos/seed/coconut-oil-herbal/400/300', 'Southern Province', 500, NULL),

-- Jaffna Traditional
('432ba1b7-a936-468e-951b-6ad57b84c710', 'Authentic Jaffna Curry Powder', 'A fiery and aromatic blend of hand-roasted spices, following a traditional family recipe from the Jaffna peninsula.', 1200.00, 3.80, 'https://picsum.photos/seed/jaffna-curry-powder/400/300', 'Jaffna', 250, 'The unique roasting process gives Jaffna curry its distinctive dark color and deep flavour.'),
('432ba1b7-a936-468e-951b-6ad57b84c710', 'Jaffna Mango Pickle', 'Tangy, spicy mango pickle made the traditional Jaffna way with mustard, fenugreek and chili.', 900.00, 2.80, 'https://picsum.photos/seed/jaffna-pickle/400/300', 'Jaffna', 400, NULL),

-- Palm Traditional
('70de5612-8517-43ad-87d0-dd1f8fdfd9bd', 'Palmyra Jaggery (Panam Karupatti)', 'Pure, unrefined jaggery from the sap of the Palmyra palm. A healthy natural sweetener with a rich, smoky flavour.', 950.00, 3.00, 'https://picsum.photos/seed/palmyra-jaggery/400/300', 'Northern Province', 500, 'The Palmyra palm is considered the "celestial tree" in Tamil culture.'),
('70de5612-8517-43ad-87d0-dd1f8fdfd9bd', 'Hand-Woven Palmyra Leaf Basket', 'A beautiful and durable basket, intricately woven by skilled artisans from dried Palmyra palm leaves.', 2500.00, 7.80, 'https://picsum.photos/seed/palmyra-leaf-crafts/400/300', 'Mannar', 400, NULL),

-- Homemade Products
('d7819117-54d5-486f-8822-e1f5ce728af4', 'Homemade Lime Pickle', 'Traditional homemade lime pickle, aged to perfection with a perfect balance of sour, salty and spicy.', 700.00, 2.20, 'https://picsum.photos/seed/lime-pickle-homemade/400/300', 'Kandy', 350, NULL),
('d7819117-54d5-486f-8822-e1f5ce728af4', 'Homemade Coconut Oil', 'Pure coconut oil extracted at home using traditional methods. No preservatives, no chemicals.', 1400.00, 4.40, 'https://picsum.photos/seed/homemade-coconut-oil/400/300', 'Kurunegala', 750, NULL),

-- Health & Wellness
('4fab2cc9-b43b-4088-adbc-aa0b5f0e07ba', 'Herbal Porridge Mix (Kola Kanda)', 'A nutritious instant mix of rice and several medicinal herbs. Just add coconut milk for a healthy breakfast.', 850.00, 2.70, 'https://picsum.photos/seed/kola-kanda/400/300', 'Rural Villages', 300, 'Kola Kanda is a traditional herbal gruel embodying the principle of "food as medicine".'),
('4fab2cc9-b43b-4088-adbc-aa0b5f0e07ba', 'Bee Honey (Wild Forest)', 'Pure wild forest honey collected by traditional honey gatherers from the jungles of Sri Lanka.', 2200.00, 6.90, 'https://picsum.photos/seed/wild-honey-lanka/400/300', 'Sinharaja', 500, NULL),

-- Apparel & Textile
('2bfcebeb-707d-4e55-99a8-2d4e4692a0fe', 'Handloom Cotton Saree', 'A soft, breathable cotton saree woven on a traditional handloom with elegant minimalist patterns.', 6800.00, 21.00, 'https://picsum.photos/seed/handloom-saree/400/300', 'Jaffna', NULL, 'The handloom industry in Jaffna produces high-quality textiles with unique designs.'),
('2bfcebeb-707d-4e55-99a8-2d4e4692a0fe', 'Batik Sarong', 'A colorful hand-dyed batik sarong, perfect for casual wear or as a beach wrap.', 3500.00, 11.00, 'https://picsum.photos/seed/batik-sarong/400/300', 'Matale', 250, NULL);
