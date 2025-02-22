<script lang="ts">
import type { AnimalItem } from "$lib/models/AnimalItem";
import { format } from "$lib/ui/date";

export let data: AnimalItem;
</script>

<section>
	<img src={data.source.filename} alt="미리보기" loading="lazy" />
	<div>
		<p>
			중성화
			<mark style:background-color={data.highlightColor}>
				{data.neutralizedLabel[0]}
			</mark>
			{data.neutralizedLabel[1]}
			<mark style:background-color={data.highlightColor}>{data.age}</mark>에
			<mark style:background-color={data.highlightColor}>{data.weight}</mark>짜리
			<mark style:background-color={data.highlightColor}>{data.sex}</mark>
			<mark style:background-color={data.highlightColor}>{data.source.kindCd}</mark>
		</p>
		<p>
			<mark style:background-color={data.highlightColor}>{format(data.foundAt)}</mark>에
			<mark style:background-color={data.highlightColor}>{data.source.happenPlace}</mark>에서 발견
		</p>
		<p>
			<mark style:background-color={data.highlightColor}>{format(data.noticeStart)}</mark>부터
			<mark style:background-color={data.highlightColor}>{format(data.noticeEnd)}</mark>까지 공고
		</p>
	</div>
</section>

<style>
	section {
		border: var(--border-width) solid black;
		border-radius: var(--card-border-radius);
		background-color: white;
		display: flex;
		align-items: center;
		flex-direction: row;

		@media (max-width: 768px) {
			flex-direction: column;
		}

		& img {
			border-radius: calc(var(--card-border-radius) * 0.5);
			--thumbnail-size: 140px;
			width: var(--thumbnail-size);
			height: var(--thumbnail-size);
			--margin: 0.5rem;
			margin: var(--margin);
			object-fit: cover;
			background-color: grey;

			@media (max-width: 768px) {
				width: calc(100% - var(--margin) * 2);
			}
		}

		& p {
			margin-inline-start: 1.6em;
			line-height: 1.8;

			@media (max-width: 768px) {
				margin-inline-start: 0.5rem;
				margin-inline-end: 0.5rem;
			}
		}

		& p mark {
			--padding-horizontal: 0.2em;
			--padding-vertical: 0.2em;
			padding-block-start: var(--padding-vertical);
			padding-block-end: var(--padding-vertical);
			padding-inline-start: var(--padding-horizontal);
			padding-inline-end: var(--padding-horizontal);
			backdrop-filter: brightness(0.7) opacity(0.5) saturate(1.1);
			font-weight: 900;
		}
	}
</style>
