<script lang="ts">
import type { AnimalItem } from "$lib/models/AnimalItem";
import ExtraCard from "./ExtraCard.svelte";

export let data: AnimalItem;
</script>

<div>
	<ExtraCard id={data.id + 1} slideInFrom={['right', 'up']}>
		<span>보호소</span>
		<h4>{data.source.careNm}</h4>
		<a href={`tel:${data.source.careTel}`}>{data.source.careTel}</a>
	</ExtraCard>
	<ExtraCard id={data.id + 2} slideInFrom={['right', 'down']}>
		<span>관할기관</span>
		<h4>{data.source.orgNm} {data.source.chargeNm ?? ''}</h4>
		<a href={`tel:${data.source.officetel}`}>{data.source.officetel}</a>
	</ExtraCard>
</div>

<style>
	h4 {
		margin: 0;
		line-height: 1;
	}

	a {
		text-decoration: none;
		color: initial;
	}

	a[href^='tel:']::before {
		content: '📞';
		display: inline-block;
	}

	:global(:hover) > a::before {
		--degree: 25deg;
		animation-name: jiggle;
		animation-duration: 0.125s;
		animation-iteration-count: 4;
	}

	@keyframes jiggle {
		33% {
			transform: rotateZ(calc(0 - var(--degree)));
		}
		67% {
			transform: rotateZ(var(--degree));
		}
	}
</style>
