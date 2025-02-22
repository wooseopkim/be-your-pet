<script lang="ts">
import type { AnimalItem } from "$lib/models/AnimalItem";

export let data: AnimalItem;
</script>

<footer class="cursive" class:terminated={data.terminated}>
	<span style:background-color={data.primaryColor}></span>
	{data.source.specialMark}<br />
	{data.source.noticeComment ?? ''}
</footer>

<style>
	footer {
		border: var(--border-width) solid black;
		background-color: white;
		margin-block-start: 1rem;
		--padding-horizontal: 1.5rem;
		--padding-vertical: 1rem;
		padding-block-start: var(--padding-vertical);
		padding-block-end: var(--padding-vertical);
		padding-inline-start: var(--padding-horizontal);
		padding-inline-end: var(--padding-horizontal);
		display: flex;
		align-items: center;
		--shadow-offset: 6px;
		box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
		--translate-by: calc(0px - var(--shadow-offset) / 2);
		transform: translateX(var(--translate-by)) translateY(var(--translate-by));

		&.terminated {
			box-shadow: none;
		}
	}

	span {
		border: 3px solid black;
		border-radius: 50%;
		display: inline-block;
		--bullet-size: 0.5rem;
		width: var(--bullet-size);
		height: var(--bullet-size);
		margin-inline-end: 2rem;
		--shadow-offset: 2px;
		box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
		--translate-by: calc(0px - var(--shadow-offset) / 2);
		transform: translateX(var(--translate-by)) translateY(var(--translate-by));
	}

	:global(:hover) > footer:not(.terminated) {
		animation-name: bounce;
		animation-duration: calc(var(--bounce-duration) * 2);
		animation-timing-function: ease-in-out;
	}

	@keyframes bounce {
		50% {
			--shadow-offset: 8px;
			box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
			scale: 101%;
		}
	}
</style>
