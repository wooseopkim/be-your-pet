<script lang="ts">
import cyrb53a from "$lib/cyrb53a";
import type { AnimalItem } from "$lib/models/AnimalItem";
import ExtraCard from "./ExtraCard.svelte";

export let data: AnimalItem;
let address: string;
let id: number;
$: {
  address = data.source.careAddr;
  id = data.id + cyrb53a(address);
}
</script>

<ExtraCard {id} slideInFrom={['left', 'down']}>
	<a href={`https://map.kakao.com/?q=${address}`} target="_blank" referrerpolicy="no-referrer">
		{address}
	</a>
</ExtraCard>

<style>
	a {
		line-height: 1.5;
		text-decoration: none;
		color: initial;
	}

	a[target='_blank']::before {
		content: '🌏';
		display: inline-block;
	}

	:global(:hover) > a::before {
		animation-name: rotate;
		animation-duration: 0.2s;
		animation-iteration-count: 2;
	}

	@keyframes rotate {
		to {
			transform: rotateZ(-360deg);
		}
	}
</style>
