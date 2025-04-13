<script lang="ts">
import type { AnimalRecord } from "$lib/db/AnimalRecord";
import { loadAnimalPage } from "$lib/db/animals";
import pages from "$lib/store/animalPages";
import { onDestroy, onMount } from "svelte";
import AnimalListPage from "./AnimalListPage.svelte";
import SearchInput from "./SearchInput.svelte";

export let size: number;
export let query: string | undefined = undefined;

onMount(() => onLoadRequest(undefined));

function onLoadRequest(data: AnimalRecord | undefined) {
  const oldPages = $pages;
  const lastPage = oldPages[oldPages.length - 1];
  if (lastPage?.loading) {
    return;
  }
  const id =
    lastPage?.content?.[lastPage?.content?.length - 1]?.body?.desertionNo ?? "";
  pages.set([...oldPages, { id, loading: true, after: data, query, size }]);
}

let pid: ReturnType<typeof setTimeout> | undefined = undefined;
function onSearch(value: string) {
  clearTimeout(pid);
  pid = setTimeout(() => {
    if (query !== value) {
      pages.set([
        { id: "", loading: true, after: undefined, query: value, size },
      ]);
    }
  }, 500);
  query = value;
}

const unsubscribe = pages.subscribe(async (value) => {
  if (value.length === 0) {
    return;
  }
  const lastPage = value[value.length - 1];
  if (!lastPage.loading) {
    return;
  }
  const { after, query, size } = lastPage;
  const newPage = await loadAnimalPage({ size, after, pred: query });
  const id = after?.body?.desertionNo ?? "";
  pages.set([
    ...value.slice(0, value.length - 1),
    {
      id,
      loading: false,
      content: newPage.data,
      error: newPage.error,
    },
  ]);
});
onDestroy(() => unsubscribe());
</script>

<SearchInput on:search={(e) => onSearch(e.detail)} />
{#each $pages as page, index}
	{#key page.id}
		{#if index === $pages.length - 1}
			<AnimalListPage data={page} on:loadrequest={(e) => onLoadRequest(e.detail ?? undefined)} />
		{:else}
			<AnimalListPage data={page} />
		{/if}
	{/key}
{/each}
