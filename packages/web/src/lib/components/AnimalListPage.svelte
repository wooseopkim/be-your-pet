<script lang="ts">
	import type { AnimalRecord } from '$lib/db/AnimalRecord';
	import type { AnimalPage } from '$lib/store/animalPages';
	import type { PostgrestError } from '@supabase/supabase-js';
	import Error from './AnimalListPage/Error.svelte';
	import List from './AnimalListPage/List.svelte';
	import Loading from './AnimalListPage/Loading.svelte';

	export let data: AnimalPage;
	export let error: PostgrestError | null = null;
	let content: AnimalRecord[];

	$: if (!data.loading && !error) {
		content = data.content ?? [];
	}
</script>

{#if error}
	<Error value={error} />
{:else if data.loading}
	<Loading />
{:else}
	<List {content} on:loadrequest />
{/if}
