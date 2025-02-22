<script lang="ts">
import type { AnimalItem } from "$lib/models/AnimalItem";
import Body from "./Body.svelte";
import Footer from "./Footer.svelte";
import Header from "./Header.svelte";

export let data: AnimalItem;
</script>

<article style:background-color={data.primaryColor} class:terminated={data.terminated}>
	<Header {data} />
	<Body {data} />
	<Footer {data} />
</article>

<style>
	article {
		border: var(--border-width) solid black;
		--card-border-radius: 16px;
		border-radius: var(--card-border-radius);
		--shadow-offset: 8px;
		box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
		transform: translateX(calc(0px - var(--shadow-offset) / 2));
		--margin-horizontal: 1rem;
		--margin-vertical: 2rem;
		margin-inline-start: var(--margin-horizontal);
		margin-inline-end: var(--margin-horizontal);
		margin-block-start: var(--margin-vertical);
		margin-block-end: var(--margin-vertical);
		--padding-horizontal: 2rem;
		--padding-vertical: 1.5rem;
		padding: var(--padding-vertical) var(--padding-horizontal);
		width: var(--card-width);
		max-width: calc(80cqi - 2 * var(--padding-horizontal) - 2 * var(--margin-horizontal));
		--bounce-duration: 0.2s;
		transition-duration: var(--bounce-duration);
		transition-property: box-shadow, transform, opacity;
		transition-timing-function: ease-in-out;
		cursor: pointer;
		position: relative;
		z-index: 1;

		@media (max-width: 768px) {
			--margin-horizontal: 0.5rem;
			--margin-vertical: 1rem;
			--padding-horizontal: 1rem;
			--padding-vertical: 1rem;
		}

		&.terminated {
			filter: brightness(0.8) grayscale(1);
			box-shadow: none;

			&:not(:hover) {
				opacity: 0.6;
			}
		}

		&:not(.terminated):hover {
			--shadow-offset: 24px;
		}
	}
</style>
