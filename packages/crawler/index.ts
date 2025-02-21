import type { SupabaseClient } from '@supabase/supabase-js';
import handle, { type Request } from './src/handle';

export default async function crawl(supabase: SupabaseClient, request?: Request) {
	const result = await handle(supabase, request);
	if (result === undefined) {
		return;
	}
	await crawl(supabase, {
		page: result.next.page,
		size: result.next.size,
		totalCount: result.totalCount,
	});
}
