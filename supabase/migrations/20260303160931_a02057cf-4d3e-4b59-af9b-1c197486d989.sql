
UPDATE categories SET image_url = CASE id
  WHEN 'b3f58804-29a2-4de7-a4cf-0b215153189d' THEN '/categories/apparel-textiles.jpg'
  WHEN '8dbbcf6c-3eea-4c6c-bbed-70d79744f4e9' THEN '/categories/ayurvedic-medicine.jpg'
  WHEN '9a6dc070-6860-442b-bb70-57b04e0709aa' THEN '/categories/dry-fishes.jpg'
  WHEN '2bceffa2-a749-4a0e-88f9-cf75d19e0ee6' THEN '/categories/english-medicine.jpg'
  WHEN 'd23dc67f-485e-414a-ab7b-52d8d198c06a' THEN '/categories/health-wellness.jpg'
  WHEN 'eaf90954-45af-4a5b-83e0-e7c61b50b814' THEN '/categories/homemade-products.jpg'
  WHEN 'dd05348e-4a72-4a64-bd22-6c6526364f92' THEN '/categories/jaffna-traditional.jpg'
  WHEN 'ca4928fa-c695-440f-9347-200ec7e87660' THEN '/categories/palm-foods.jpg'
  WHEN '9d8cc092-18b9-4cd6-ae71-91f8f8a1d3e7' THEN '/categories/palm-traditional.jpg'
  WHEN 'a0c2ae79-de48-4ab2-a660-36cd373a4600' THEN '/categories/palm-based-products.jpg'
  WHEN '2d6cbadf-fcb5-4c29-9850-7d46914ac643' THEN '/categories/pickles.jpg'
  WHEN '23072da3-add1-4749-b2de-51bb27f1fcf3' THEN '/categories/pickles.jpg'
  WHEN 'f9bbc74a-0dfe-43a7-bc28-20147c665a16' THEN '/categories/powder.jpg'
  WHEN 'ef24adb1-6b57-4fd8-b29c-e3e9c234511b' THEN '/categories/powder.jpg'
  WHEN '3f2eb893-1493-49a2-a3af-b9f79e1a051c' THEN '/categories/snacks.jpg'
  WHEN '8102aad9-3925-487d-ac45-1d3327f6195a' THEN '/categories/tea-coffee.jpg'
  WHEN 'aa986169-64a2-4883-8e50-27810c990292' THEN '/categories/sweets.jpg'
  WHEN '46c00b43-b8b2-4fb9-b817-1ea6448e7be9' THEN '/categories/sweets-snacks.jpg'
END
WHERE id IN (
  'b3f58804-29a2-4de7-a4cf-0b215153189d','8dbbcf6c-3eea-4c6c-bbed-70d79744f4e9',
  '9a6dc070-6860-442b-bb70-57b04e0709aa','2bceffa2-a749-4a0e-88f9-cf75d19e0ee6',
  'd23dc67f-485e-414a-ab7b-52d8d198c06a','eaf90954-45af-4a5b-83e0-e7c61b50b814',
  'dd05348e-4a72-4a64-bd22-6c6526364f92','ca4928fa-c695-440f-9347-200ec7e87660',
  '9d8cc092-18b9-4cd6-ae71-91f8f8a1d3e7','a0c2ae79-de48-4ab2-a660-36cd373a4600',
  '2d6cbadf-fcb5-4c29-9850-7d46914ac643','23072da3-add1-4749-b2de-51bb27f1fcf3',
  'f9bbc74a-0dfe-43a7-bc28-20147c665a16','ef24adb1-6b57-4fd8-b29c-e3e9c234511b',
  '3f2eb893-1493-49a2-a3af-b9f79e1a051c','8102aad9-3925-487d-ac45-1d3327f6195a',
  'aa986169-64a2-4883-8e50-27810c990292','46c00b43-b8b2-4fb9-b817-1ea6448e7be9'
);
