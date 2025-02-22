<script lang="ts">
import { createEventDispatcher } from "svelte";

// biome-ignore lint/style/useConst: reassigned by Svelte
let content = "";

const dispatch = createEventDispatcher<{
  search: string;
}>();

function onChange(e: KeyboardEvent) {
  const target = e.target as HTMLInputElement | null;
  dispatch("search", target?.value ?? "");
}
</script>

<input
	on:keyup={onChange}
	placeholder="🔎 동물 친구를 찾아보세요!"
	bind:value={content}
	class:cursive={content.length > 0}
/>

<style>
	input {
		width: 26rem;
		font-size: 2rem;
		margin-top: 2rem;
		margin-bottom: 2rem;
		padding: 1rem;
	}

	input:focus::placeholder {
		display: none;
		opacity: 0;
	}
</style>
