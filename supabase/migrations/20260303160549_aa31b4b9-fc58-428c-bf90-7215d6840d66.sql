
UPDATE products SET image_url = CASE id
  WHEN '713e713f-7a8a-4ba5-96bd-e83b68c6a204' THEN '/products/dried-prawns.jpg'
  WHEN 'd21576b9-3c0d-4a41-983f-df6128f9c9ae' THEN '/products/dry-fish.jpg'
  WHEN 'c8983542-9ac2-4813-a0a7-e140bb17a7f6' THEN '/products/palm-jaggery-adhirasam.jpg'
  WHEN '5e74a4fd-ae8c-4b88-b1d6-b98ab3d37c51' THEN '/products/palm-jaggery-adhirasam.jpg'
  WHEN 'baa32d74-89a9-40b5-80b4-ebdd61e15788' THEN '/products/palm-jaggery-halwa.jpg'
  WHEN 'f6393ddb-8354-420f-8d56-4f9c7803f447' THEN '/products/palm-sweet-balls.jpg'
  WHEN '1a0627ca-0ff4-4140-bac1-d900909ccf72' THEN '/products/palmyra-leaf-box.jpg'
  WHEN '9b6204b3-3893-4e9e-84c6-e821d02cc171' THEN '/products/palm-leaf-art.jpg'
  WHEN 'fa7d683e-681c-4171-9107-693b18a817fc' THEN '/products/palmyra-leaf-bag.jpg'
  WHEN '72f9ee58-4bd4-4544-a4b5-fbb9b235f2fe' THEN '/products/palmyra-leaf-basket.jpg'
  WHEN '40dd6efd-29cd-4efb-8976-308a5859c02e' THEN '/products/palmyra-leaf-fan.jpg'
  WHEN '59e65708-ac09-4c06-9b63-e00f5454aca4' THEN '/products/palmyra-leaf-plate.jpg'
  WHEN 'f28d3024-7010-46e9-a6a8-23c5002356dd' THEN '/products/storage-boxes.jpg'
  WHEN 'ea609e52-5932-471d-bb48-ca1f4ee0bdcc' THEN '/products/traditional-decorative-items.jpg'
  WHEN 'b2880dc9-07cc-4cc8-89c4-ea6d4c026ec0' THEN '/products/wedding-gift-boxes.jpg'
  WHEN 'ea7b9843-dbed-4fa5-84ef-5006a93034dc' THEN '/products/fish-pickle.jpg'
  WHEN '00a3ce42-4032-4b23-a397-d3d3c590729d' THEN '/products/garlic-pickle.jpg'
  WHEN '94816755-2b2b-4fc5-a3d7-b46d86c01aa2' THEN '/products/jaffna-amla-pickle.jpg'
  WHEN 'b0459eb4-2f8a-4503-9e84-221d4dbec1c3' THEN '/products/lemon-pickle.jpg'
  WHEN 'cf758732-a675-48b9-9306-13e068de020c' THEN '/products/mango-pickle.jpg'
  WHEN '15daad1c-bfc5-48ad-87ee-789784bd1e7d' THEN '/products/adhirasam.jpg'
  WHEN '817597c3-9dd1-47ab-b52a-e820e53b9d48' THEN '/products/laddu.jpg'
  WHEN '9651bd44-7da1-4fe4-bea6-5ddcb863aa86' THEN '/products/palm-jaggery-halwa.jpg'
  WHEN '58201095-95e0-40e4-b5fd-ddd05ad53d57' THEN '/products/palm-sweet-balls.jpg'
  WHEN 'a71b73ca-051d-4e47-a09a-8cf27f168427' THEN '/products/paniyaram.jpg'
  WHEN '61666067-bc72-4b8d-a704-8c6fa2783b7e' THEN '/products/adhirasam.jpg'
  WHEN 'dcacd784-6158-4b85-9e76-37421ffc8258' THEN '/products/laddu.jpg'
  WHEN '5544fb78-ae5a-4bc4-aa66-9132b11d1b47' THEN '/products/paniyaram.jpg'
END
WHERE id IN (
  '713e713f-7a8a-4ba5-96bd-e83b68c6a204','d21576b9-3c0d-4a41-983f-df6128f9c9ae',
  'c8983542-9ac2-4813-a0a7-e140bb17a7f6','5e74a4fd-ae8c-4b88-b1d6-b98ab3d37c51',
  'baa32d74-89a9-40b5-80b4-ebdd61e15788','f6393ddb-8354-420f-8d56-4f9c7803f447',
  '1a0627ca-0ff4-4140-bac1-d900909ccf72','9b6204b3-3893-4e9e-84c6-e821d02cc171',
  'fa7d683e-681c-4171-9107-693b18a817fc','72f9ee58-4bd4-4544-a4b5-fbb9b235f2fe',
  '40dd6efd-29cd-4efb-8976-308a5859c02e','59e65708-ac09-4c06-9b63-e00f5454aca4',
  'f28d3024-7010-46e9-a6a8-23c5002356dd','ea609e52-5932-471d-bb48-ca1f4ee0bdcc',
  'b2880dc9-07cc-4cc8-89c4-ea6d4c026ec0','ea7b9843-dbed-4fa5-84ef-5006a93034dc',
  '00a3ce42-4032-4b23-a397-d3d3c590729d','94816755-2b2b-4fc5-a3d7-b46d86c01aa2',
  'b0459eb4-2f8a-4503-9e84-221d4dbec1c3','cf758732-a675-48b9-9306-13e068de020c',
  '15daad1c-bfc5-48ad-87ee-789784bd1e7d','817597c3-9dd1-47ab-b52a-e820e53b9d48',
  '9651bd44-7da1-4fe4-bea6-5ddcb863aa86','58201095-95e0-40e4-b5fd-ddd05ad53d57',
  'a71b73ca-051d-4e47-a09a-8cf27f168427','61666067-bc72-4b8d-a704-8c6fa2783b7e',
  'dcacd784-6158-4b85-9e76-37421ffc8258','5544fb78-ae5a-4bc4-aa66-9132b11d1b47'
);
