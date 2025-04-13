<script lang="ts">
import AnimalList from "$lib/components/AnimalList.svelte";
import { Random } from "$lib/ui/random";
import "modern-normalize";

const MINUTE_IN_MILLIS = 1000 * 60;
const seed = Math.floor(Date.now() / MINUTE_IN_MILLIS);
const random = new Random(seed);
const backgroundColor = random.rgb({
  base: 216,
  diff: 32,
});
</script>

<main style:background-color={backgroundColor}>
	<AnimalList size={5} />
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
