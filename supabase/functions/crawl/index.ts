import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import crawl from "@be-your-pet/crawler";
import {
  NoOpenApiServiceKeyProvidedError,
  DatabaseInsertError,
  MalformedApiResponseError,
  UnsuccessfulApiResponseError,
} from "@be-your-pet/crawler/src/errors";

Deno.serve(async (req) => {
  const token = req.headers.get("Authorization")?.replace(/^Bearer /, "") ?? "";
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (token !== key) {
    return new Response(null, { status: 404 });
  }

  const body = await req.json();
  const openApiServiceKey = body.open_api_service_key;

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

  try {
    const result = await crawl(supabase, {
      openApiServiceKey,
    });

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: unknown) {
    if (e instanceof NoOpenApiServiceKeyProvidedError) {
      return new Response(e.message, { status: 400 });
    }
    if (e instanceof MalformedApiResponseError) {
      return new Response(e.message, { status: 500 });
    }
    if (e instanceof UnsuccessfulApiResponseError) {
      return new Response(e.message, { status: 500 });
    }
    if (e instanceof DatabaseInsertError) {
      return new Response(e.message, { status: 500 });
    }
  }
  return new Response("unknown error", { status: 500 });
});
