<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let w = 0;
	let h = 0;
	let animId: number;

	// Perlin noise
	const P = new Uint8Array(512);
	for (let i = 0; i < 256; i++) P[i] = i;
	for (let i = 255; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[P[i], P[j]] = [P[j], P[i]];
	}
	for (let i = 0; i < 256; i++) P[i + 256] = P[i];

	function fd(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
	function lr(a: number, b: number, t: number) { return a + t * (b - a); }
	function grd(hash: number, x: number, y: number) {
		const h2 = hash & 3;
		return ((h2 & 1) ? -x : x) + ((h2 & 2) ? -y : y);
	}
	function noise(x: number, y: number) {
		const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
		x -= Math.floor(x); y -= Math.floor(y);
		const u = fd(x), v = fd(y);
		const A = P[X] + Y, B = P[X + 1] + Y;
		return lr(
			lr(grd(P[A], x, y), grd(P[B], x - 1, y), u),
			lr(grd(P[A + 1], x, y - 1), grd(P[B + 1], x - 1, y - 1), u),
			v
		);
	}

	function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }

	const ROWS = 70;
	const COLS = 120;
	const STRIP_HEIGHT = 55;
	let time = 0;
	let targetScroll = 0;
	let smoothScroll = 0;

	// Bindable state for parent to read
	let { isSticky = $bindable(false) }: { isSticky?: boolean } = $props();

	function handleScroll() {
		targetScroll = window.scrollY;
	}

	function resize() {
		if (!canvas) return;
		w = canvas.width = window.innerWidth;
		h = canvas.height = window.innerHeight;
	}

	function animate() {
		if (!ctx) return;
		ctx.clearRect(0, 0, w, h);
		time += 0.003;

		smoothScroll += (targetScroll - smoothScroll) * 0.04;

		const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
		const sp = maxScroll > 0 ? smoothScroll / maxScroll : 0;
		const scrollOffset = sp * 8;

		const heroExit = clamp01(smoothScroll / (h * 0.8));
		const fullHeight = h;
		const currentHeight = fullHeight + (STRIP_HEIGHT - fullHeight) * heroExit * heroExit;
		const terrainTop = 0;
		const heightRatio = currentHeight / fullHeight;
		const amplitude = 0.22 * Math.max(heightRatio, 0.06);

		const stickyDim = heroExit > 0.8 ? 0.4 : 1;
		const baseAlpha = (0.04 + (1 - heightRatio) * 0.06) * stickyDim;
		const maxAlpha = (0.35 + (1 - heightRatio) * 0.1) * stickyDim;
		const baseHue = 265 - sp * 15;
		const hueRange = 35;
		const glowThreshold = 0.25;
		const glowStrength = (0.25 + (1 - heightRatio) * 0.1) * stickyDim;

		isSticky = heroExit > 0.5;

		// Dark backdrop when sticky
		if (isSticky) {
			const backdropAlpha = clamp01((heroExit - 0.5) * 4);
			ctx.fillStyle = `rgba(2, 0, 5, ${backdropAlpha})`;
			ctx.fillRect(0, 0, w, STRIP_HEIGHT);
		}

		const cellW = (w * 1.4) / (COLS - 1);
		const offsetX = -w * 0.2;

		// Horizontal lines
		for (let r = ROWS - 1; r >= 0; r--) {
			const rowDepth = r / ROWS;
			const z = 0.1 + rowDepth * 0.9;
			const yOffset = terrainTop + rowDepth * currentHeight;
			const points: { x: number; y: number; elevation: number }[] = [];

			ctx.beginPath();
			for (let col = 0; col < COLS; col++) {
				const x = offsetX + col * cellW;
				const nx = col / COLS * 3.5;
				const ny = r / ROWS * 2.5 + scrollOffset + time * 1.8;
				const n = noise(nx, ny);
				const elevation = n * h * z * amplitude;
				const screenY = yOffset - elevation;
				points.push({ x, y: screenY, elevation: Math.abs(n) });
				if (col === 0) ctx.moveTo(x, screenY); else ctx.lineTo(x, screenY);
			}

			const intensity = 1 - rowDepth;
			const hue = baseHue + rowDepth * hueRange;
			const alpha = baseAlpha + intensity * maxAlpha;
			ctx.strokeStyle = `hsla(${hue}, 65%, ${35 + intensity * 30}%, ${alpha})`;
			ctx.lineWidth = 0.4 + intensity * 1.2;
			ctx.stroke();

			// Glow on peaks
			if (intensity > 0.3 && amplitude > 0.02) {
				for (const pt of points) {
					if (pt.elevation > glowThreshold) {
						const gi = (pt.elevation - glowThreshold) * 3.5 * intensity;
						const radius = 8 + gi * 14;
						const gr = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius);
						gr.addColorStop(0, `hsla(${hue - 10}, 90%, 70%, ${gi * glowStrength})`);
						gr.addColorStop(0.5, `hsla(${hue}, 80%, 55%, ${gi * glowStrength * 0.3})`);
						gr.addColorStop(1, 'transparent');
						ctx.fillStyle = gr;
						ctx.beginPath();
						ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
						ctx.fill();
					}
				}
			}
		}

		// Vertical cross-lines
		if (heightRatio > 0.2) {
			for (let col = 0; col < COLS; col += 4) {
				ctx.beginPath();
				for (let r = 0; r < ROWS; r++) {
					const rowDepth = r / ROWS;
					const z = 0.1 + rowDepth * 0.9;
					const yOffset = terrainTop + rowDepth * currentHeight;
					const x = offsetX + col * cellW;
					const ny = r / ROWS * 2.5 + scrollOffset + time * 1.8;
					const n = noise(col / COLS * 3.5, ny);
					const screenY = yOffset - n * h * z * amplitude;
					if (r === 0) ctx.moveTo(x, screenY); else ctx.lineTo(x, screenY);
				}
				ctx.strokeStyle = `hsla(${baseHue + 10}, 50%, 40%, ${0.04 * heightRatio})`;
				ctx.lineWidth = 0.5;
				ctx.stroke();
			}
		}

		// Ambient glow
		const terrainCenterY = terrainTop + currentHeight * 0.5;
		const ambient = ctx.createRadialGradient(w / 2, terrainCenterY, 0, w / 2, terrainCenterY, w * 0.3);
		ambient.addColorStop(0, 'rgba(130, 60, 240, 0.07)');
		ambient.addColorStop(0.4, 'rgba(100, 40, 200, 0.03)');
		ambient.addColorStop(1, 'transparent');
		ctx.fillStyle = ambient;
		ctx.fillRect(0, 0, w, h);

		animId = requestAnimationFrame(animate);
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resize();
		window.addEventListener('resize', resize);
		window.addEventListener('scroll', handleScroll, { passive: true });
		animate();
	});

	onDestroy(() => {
		if (animId) cancelAnimationFrame(animId);
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', resize);
			window.removeEventListener('scroll', handleScroll);
		}
	});
</script>

<canvas
	bind:this={canvas}
	class="terrain"
	class:sticky={isSticky}
></canvas>

<style>
	.terrain {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
	}

	.terrain.sticky {
		z-index: 5;
	}
</style>
