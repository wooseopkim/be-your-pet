<script lang="ts">
	import Contacts from './AnimalItem/extras/Contacts.svelte';
	import Location from './AnimalItem/extras/Location.svelte';
	import MainCard from './AnimalItem/main/MainCard.svelte';
	import type { AnimalItem } from '$lib/models/AnimalItem';

	export let data: AnimalItem;
	let showExtras: boolean;
	$: showExtras = !data.terminated;
</script>

<div class="container">
	<MainCard {data} />
	{#if showExtras}
		<section class="extras">
			<Location {data} />
			<div class="extra-spacer"></div>
			<Contacts {data} />
		</section>
	{/if}
</div>

<style>
	.container {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		content-visibility: auto;
		contain-intrinsic-height: auto 0;
		--card-width: 52rem;
		--shadow-color: rgba(0, 0, 0, 0.9);
		--border-width: 4px;

		@media (max-width: 1440px) {
			flex-direction: column;
			overflow-y: hidden;
		}
	}

	.extras {
		display: none;

		@media (min-width: 768px) and (max-width: 1440px) {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			overflow-x: clip;
			padding-block-end: 2.4rem;

			& > *:last-child {
				display: flex;
			}
		}

		@media (min-width: 1440px) {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			width: 100%;

			& .extra-spacer {
				width: var(--card-width);
				--padding-horizontal: 6rem;
				padding-inline-start: var(--padding-horizontal);
				padding-inline-end: var(--padding-horizontal);
			}
		}
	}
</style>
