<script lang="ts">
import AnimalList from "$lib/components/AnimalList.svelte";
import pages from "$lib/store/animalPages";
import "modern-normalize";
import { onMount } from "svelte";
import type { load } from "./+page.server.js";

export let data: Awaited<ReturnType<typeof load>>;

onMount(() => {
  pages.set([data.firstPage]);
});
</script>

<main style:background-color={data.backgroundColor}>
	<AnimalList size={data.size} />
</main>

<style>
    @import url("../assets/fonts/nanum-square-neo/style.css");
    @import url("../assets/fonts/kcc-jeongbeom/style.css");

	:root {
		font-family: 'Nanum Square Neo', sans-serif;
		font-size: 1.1rem;
		font-weight: 800;
	}

	:global(.cursive) {
		font-family: 'KCC Jeongbeom', cursive;
		font-weight: 600;
	}

	main {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	:root,
	main {
		overflow-x: hidden;
	}

	:global(*) {
		box-sizing: initial;
	}
</style>
