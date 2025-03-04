import type { SupabaseClient } from "@supabase/supabase-js";
import handle, { type Request } from "./src/handle";

export default async function crawl(
  supabase: SupabaseClient,
  request: Request,
  results: object[] = [],
) {
  const result = await handle(supabase, request);
  if (result === undefined) {
    return results;
  }
  return await crawl(
    supabase,
    {
      page: result.next.page,
      size: result.next.size,
      totalCount: result.totalCount,
      openApiServiceKey: request.openApiServiceKey,
    },
    [...results, result],
  );
}
