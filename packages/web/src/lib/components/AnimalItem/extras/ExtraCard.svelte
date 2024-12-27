<script lang="ts">
	import addIntersectionListener from '$lib/dom/listeners';
	import { Random } from '$lib/ui/random';

	type Sign = -1 | 1;

	export let id: number;
	export let slideInFrom: ['left' | 'right', 'down' | 'up'];
	let horizontal: Sign;
	let vertical: Sign;
	$: {
		horizontal = slideInFrom[0] === 'left' ? -1 : 1;
		vertical = slideInFrom[1] === 'down' ? 1 : -1;
	}

	const random = new Random(id);

	const backgroundColor = random.rgb();
	let transform: string;
	$: {
		const opts = {
			translateX: {
				degree: horizontal * 100,
				unit: 'vw',
			},
			rotateZ: {
				degree: 30,
			},
		};
		transform = randomTransform(opts);
	}

	type TransformOpts = {
		translateX: {
			degree: number;
			unit: string;
		};
		translateY?: {
			degree: number;
			unit: string;
		};
		rotateZ: {
			degree: number;
		};
	};
	function randomTransform({ translateX, translateY, rotateZ }: TransformOpts) {
		return [
			`translateX(${new Random(id).number({
				diff: translateX.degree * 0.5,
				base: translateX.degree * 0.5,
			})}${translateX.unit})`,
			`translateY(${new Random(id).number({ diff: translateY?.degree ?? 0 })}${
				translateY?.unit ?? ''
			})`,
			`rotateZ(${new Random(id).angle({ diff: rotateZ.degree, base: 0 })})`,
		].join(' ');
	}

	let el: HTMLElement;
	$: addIntersectionListener(el, (observer) => {
		flyIn();
		observer.unobserve(el);
		el.remove();
	});

	function flyIn() {
		const getOpts = (x: Sign, y: Sign) => ({
			translateX: {
				degree: x * -0.5,
				unit: 'rem',
			},
			translateY: {
				degree: y * 1,
				unit: 'rem',
			},
			rotateZ: {
				degree: 10,
			},
		});
		transform = randomTransform(getOpts(horizontal, vertical));
	}
</script>

<div bind:this={el}></div>
<section style:background-color={backgroundColor} style:transform>
	<slot />
</section>

<style>
	section {
		border: var(--border-width) solid black;
		border-radius: 6px;
		--shadow-offset: 2px;
		box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--shadow-color);
		width: 12rem;
		min-width: 12rem;
		height: 7rem;
		padding: 1rem;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		flex-direction: column;
		text-align: end;
		line-height: 2;
		transition-property: transform, scale, box-shadow;
		transition-duration: 0.5s;
		position: relative;
		overflow: clip;

		&:hover {
			scale: 1.05;
			z-index: 1;
			--shadow-offset: 8px;
		}
	}
</style>
