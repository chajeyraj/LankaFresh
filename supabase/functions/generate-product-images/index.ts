import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getPromptForProduct(name: string, description: string, categoryName: string): string {
  const categoryPrompts: Record<string, string> = {
    "Spices & Powders": `A professional product photo of Sri Lankan "${name}" spice in a small traditional glass jar with a cork lid, on a rustic wooden surface with scattered spice elements. Warm lighting, clean white background, high quality food photography.`,
    "Traditional Pickles": `A professional product photo of homemade Sri Lankan "${name}" pickle/achar in a glass jar, vibrant colors showing the pickle ingredients, traditional Sri Lankan kitchen setting, clean background, food photography.`,
    "Traditional Sweets": `A professional product photo of Sri Lankan traditional sweet "${name}", beautifully arranged on a brass plate or banana leaf, warm golden lighting, clean background, appetizing food photography.`,
    "Palmyra Products": `A professional product photo of Sri Lankan palmyra product "${name}", natural palm-based craft or food item, earthy tones, traditional Sri Lankan aesthetic, clean background, product photography.`,
    "Dried Seafood": `A professional product photo of Sri Lankan "${name}", dried fish or seafood arranged on a woven mat, natural lighting, clean background, food photography.`,
    "Flour & Grains": `A professional product photo of Sri Lankan "${name}" flour or grain in a rustic bowl or traditional container, scattered grains around, warm natural lighting, clean background, food photography.`,
    "Handicrafts & Art": `A professional product photo of Sri Lankan handmade craft "${name}", traditional artisan work, warm lighting showcasing craftsmanship details, clean background, product photography.`,
    "Ayurvedic & Herbal": `A professional product photo of Sri Lankan ayurvedic/herbal product "${name}", natural ingredients, green herbs and leaves around, clean medicinal aesthetic, product photography.`,
    "Apparel & Textile": `A professional product photo of Sri Lankan traditional textile "${name}", draped or folded showing fabric pattern and quality, clean background, fashion product photography.`,
    "Health & Wellness": `A professional product photo of Sri Lankan health product "${name}", clean wellness aesthetic, natural ingredients visible, white/green tones, product photography.`,
  };

  return (
    categoryPrompts[categoryName] ||
    `A professional product photo of Sri Lankan product "${name}". ${description ? description.slice(0, 100) : "Traditional Sri Lankan item"}. Clean white background, high quality product photography, warm lighting.`
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get products with missing images
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("id, name, description, category_id, categories(name)")
      .or("image_url.is.null,image_url.eq.")
      .order("created_at");

    if (fetchError) throw new Error(`Fetch error: ${fetchError.message}`);
    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ message: "No products need images", processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const total = products.length;
    console.log(`Processing ${total} products`);

    // Use streaming response to report progress
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        send({ type: "start", total });

        let processed = 0;
        let errors = 0;
        const BATCH_SIZE = 3;

        for (let i = 0; i < products.length; i += BATCH_SIZE) {
          const batch = products.slice(i, i + BATCH_SIZE);

          for (const product of batch) {
            try {
              const categoryName = (product as any).categories?.name || "General";
              const prompt = getPromptForProduct(product.name, product.description, categoryName);

              console.log(`Generating image for: ${product.name}`);

              const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${LOVABLE_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "google/gemini-2.5-flash-image",
                  messages: [{ role: "user", content: prompt }],
                  modalities: ["image", "text"],
                }),
              });

              if (!aiResponse.ok) {
                const errText = await aiResponse.text();
                console.error(`AI error for ${product.name}: ${aiResponse.status} ${errText}`);
                errors++;
                send({ type: "error", product: product.name, status: aiResponse.status });
                continue;
              }

              const aiData = await aiResponse.json();
              const imageBase64 = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

              if (!imageBase64) {
                console.error(`No image returned for ${product.name}`);
                errors++;
                send({ type: "error", product: product.name, status: "no_image" });
                continue;
              }

              // Extract base64 data (remove data:image/png;base64, prefix)
              const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
              const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

              const fileName = `${product.id}-${Date.now()}.png`;
              const { error: uploadError } = await supabase.storage
                .from("product-images")
                .upload(fileName, binaryData, { contentType: "image/png", upsert: true });

              if (uploadError) {
                console.error(`Upload error for ${product.name}: ${uploadError.message}`);
                errors++;
                send({ type: "error", product: product.name, status: "upload_failed" });
                continue;
              }

              const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);

              const { error: updateError } = await supabase
                .from("products")
                .update({ image_url: urlData.publicUrl })
                .eq("id", product.id);

              if (updateError) {
                console.error(`DB update error for ${product.name}: ${updateError.message}`);
                errors++;
                send({ type: "error", product: product.name, status: "db_update_failed" });
                continue;
              }

              processed++;
              send({ type: "progress", processed, total, product: product.name });
              console.log(`✓ ${product.name} (${processed}/${total})`);
            } catch (err) {
              console.error(`Error processing ${product.name}:`, err);
              errors++;
              send({ type: "error", product: product.name, status: "unknown" });
            }
          }

          // Delay between batches to avoid rate limits
          if (i + BATCH_SIZE < products.length) {
            await new Promise((r) => setTimeout(r, 3000));
          }
        }

        send({ type: "done", processed, errors, total });
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("Function error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
