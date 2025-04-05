import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import crawl from "@be-your-pet/crawler";

Deno.serve(async (req) => {
  const token = req.headers.get("Authorization")?.replace(/^Bearer /, "") ?? "";
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (token !== key) {
    return new Response(null, { status: 404 });
  }

  const queries = new URL(req.url).searchParams;
  const openApiServiceKey = queries.get("open_api_service_key");

  if (openApiServiceKey === null) {
    return new Response(
      JSON.stringify({
        message: "Open API service key not provided",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const supabase = createClient(url, key);

  const result = await crawl(supabase, {
    openApiServiceKey,
  });

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
