<script lang="ts">
import type { AnimalRecord } from "$lib/db/AnimalRecord";
import addIntersectionListener from "$lib/dom/listeners";
import { AnimalItem } from "$lib/models/AnimalItem";
import { createEventDispatcher } from "svelte";
import Item from "../AnimalItem.svelte";

export let content: AnimalRecord[];

const dispatch = createEventDispatcher<{
  loadrequest: AnimalRecord | null;
}>();

let lastElement: HTMLElement;
$: addIntersectionListener(lastElement, (observer) => {
  dispatch("loadrequest", content[content.length - 1]);
  observer.unobserve(lastElement);
});
</script>

{#each content as { body }, i}
	{@const item = new AnimalItem(body)}
	{#key body.desertionNo}
		{#if i === content.length - 2}
			<Item data={item} />
			<div bind:this={lastElement}></div>
		{:else}
			<Item data={item} />
		{/if}
	{/key}
{/each}
