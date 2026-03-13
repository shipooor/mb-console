<script lang="ts">
	import { page } from '$app/state';
	let { children } = $props();

	const isHome = $derived(page.url.pathname === '/');
</script>

{#if !isHome}
<nav class="navbar">
	<a href="/" class="logo">
		<span class="logo-icon">MB</span>
		MagicBlock Console
	</a>
	<div class="nav-links">
		<a href="/docs/getting-started">Docs</a>
		<a href="/docs/cli">CLI</a>
		<a href="/dashboard" class="nav-cta">Dashboard</a>
	</div>
</nav>
{/if}

<main>
	{@render children()}
</main>

{#if !isHome}
<footer class="footer">
	<div class="footer-content">
		<div class="footer-section">
			<h4>MagicBlock Console</h4>
			<p>Developer console for Ephemeral Rollups on Solana.</p>
		</div>
		<div class="footer-section">
			<h4>Documentation</h4>
			<a href="/docs/getting-started">Getting Started</a>
			<a href="/docs/er-lifecycle">ER Lifecycle</a>
			<a href="/docs/features/gasless">Features</a>
		</div>
		<div class="footer-section">
			<h4>Interfaces</h4>
			<a href="/docs/cli">CLI Reference</a>
			<a href="/docs/mcp">MCP Reference</a>
			<a href="/dashboard">Web Dashboard</a>
		</div>
		<div class="footer-section">
			<h4>Project</h4>
			<a href="https://github.com/shipooor/mb-console" target="_blank" rel="noopener">GitHub</a>
			<a href="https://www.npmjs.com/package/@magicblock-console/core" target="_blank" rel="noopener">npm: core</a>
			<a href="https://www.npmjs.com/package/@magicblock-console/cli" target="_blank" rel="noopener">npm: cli</a>
			<a href="https://www.npmjs.com/package/@magicblock-console/mcp" target="_blank" rel="noopener">npm: mcp</a>
		</div>
	</div>
	<div class="footer-bottom">
		<p>Built for <a href="https://hackathon.magicblock.app/" target="_blank" rel="noopener">Solana Blitz Hackathon 2026</a></p>
		<div class="footer-shipped">
			<a class="shipped-by" href="https://x.com/shipooor" target="_blank" rel="noopener">
				<span class="shipped-stamp">S</span>
				shipped by shipooor
			</a>
			<span class="shipped-sep">·</span>
			<a class="shipped-link" href="https://github.com/shipooor" target="_blank" rel="noopener">GitHub</a>
			<span class="shipped-sep">·</span>
			<a class="shipped-link" href="https://x.com/shipooor" target="_blank" rel="noopener">X</a>
		</div>
	</div>
</footer>
{/if}

<style>
	/* Inner-page navbar (docs, etc.) — NOT used on home */
	.navbar {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 2rem;
		height: 48px;
		background: rgba(2, 0, 5, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--color-border);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--color-heading);
		letter-spacing: -0.01em;
	}

	.logo-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: var(--color-primary);
		color: #fff;
		border-radius: var(--radius-sm);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.75rem;
	}

	.nav-links a {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-text-muted);
		transition: color 0.15s ease;
	}
	.nav-links a:hover { color: var(--color-heading); }

	.nav-cta {
		padding: 0.35rem 0.875rem;
		background: var(--color-primary);
		color: #fff !important;
		border-radius: var(--radius-md);
		font-size: 0.85rem;
		font-weight: 600;
		transition: background 0.15s ease;
	}
	.nav-cta:hover { background: var(--color-primary-hover); }

	main { min-height: calc(100vh - 48px); }

	.footer {
		background: rgba(255,255,255, 0.01);
		color: var(--color-text);
		padding: 3rem 2rem 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.footer-content {
		max-width: 1100px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: 2rem;
	}

	.footer-section h4 {
		font-size: 0.9rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: var(--color-heading);
	}

	.footer-section p {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	.footer-section a {
		display: block;
		font-size: 0.85rem;
		color: var(--color-text-muted);
		margin-bottom: 0.5rem;
		transition: color 0.15s ease;
	}
	.footer-section a:hover { color: var(--color-primary); }

	.footer-bottom {
		max-width: 1100px;
		margin: 2rem auto 0;
		padding-top: 1.25rem;
		border-top: 1px solid var(--color-border);
		text-align: center;
	}
	.footer-bottom p { font-size: 0.8rem; color: var(--color-text-muted); }
	.footer-bottom a { color: var(--color-text-muted); transition: color 0.15s ease; }
	.footer-bottom a:hover { color: var(--color-primary); }

	.footer-shipped {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 0.5rem;
	}

	.shipped-by {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--color-text-muted);
		font-size: 0.8rem;
		font-weight: 500;
		transition: all 0.3s ease;
		position: relative;
	}
	.shipped-by:hover {
		color: #fff;
		text-shadow: 0 0 8px rgba(192,132,252, 0.8), 0 0 20px rgba(139,92,246, 0.5);
	}
	.shipped-by:hover .shipped-stamp {
		background: var(--color-primary);
		border-color: transparent;
		color: #fff;
		box-shadow: 0 0 12px rgba(139,92,246, 0.6), 0 0 30px rgba(139,92,246, 0.3);
		animation: stamp-chaos 0.6s ease;
	}

	.shipped-by::before,
	.shipped-by::after {
		content: '';
		position: absolute;
		border-radius: 50%;
		opacity: 0;
		pointer-events: none;
	}
	.shipped-by::before { width: 4px; height: 4px; background: #c084fc; }
	.shipped-by::after { width: 5px; height: 5px; background: #a78bfa; }
	.shipped-by:hover::before { animation: spark1 0.7s ease-out forwards; }
	.shipped-by:hover::after { animation: spark2 0.7s 0.05s ease-out forwards; }

	@keyframes stamp-chaos {
		0% { transform: rotate(-3deg) scale(1); }
		15% { transform: rotate(15deg) scale(1.4); }
		30% { transform: rotate(-10deg) scale(1.2); }
		50% { transform: rotate(360deg) scale(0.8); }
		70% { transform: rotate(375deg) scale(1.15); }
		85% { transform: rotate(355deg) scale(1.05); }
		100% { transform: rotate(357deg) scale(1.1); }
	}
	@keyframes spark1 {
		0% { left: 8px; top: 50%; opacity: 1; transform: scale(1); box-shadow: 0 0 6px #c084fc; }
		100% { left: -14px; top: -10px; opacity: 0; transform: scale(0.3); box-shadow: 0 0 0 transparent; }
	}
	@keyframes spark2 {
		0% { left: 8px; top: 50%; opacity: 1; transform: scale(1); box-shadow: 0 0 8px #a78bfa; }
		100% { left: 30px; top: -12px; opacity: 0; transform: scale(0.2); box-shadow: 0 0 0 transparent; }
	}

	.shipped-stamp {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border: 1.5px solid rgba(139,92,246, 0.4);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 700;
		color: #c084fc;
		background: rgba(139,92,246, 0.08);
		transform: rotate(-3deg);
		transition: all 0.3s ease;
		flex-shrink: 0;
	}

	.shipped-sep { color: rgba(255,255,255, 0.15); font-size: 0.8rem; }
	.shipped-link { font-size: 0.8rem; color: var(--color-text-muted); transition: color 0.2s; }
	.shipped-link:hover { color: var(--color-primary-bright); }

	@media (max-width: 768px) {
		.navbar { padding: 0 1rem; }
		.nav-links { gap: 1rem; }
		.nav-links a:not(.nav-cta) { display: none; }
		.footer-content { grid-template-columns: 1fr; gap: 1.5rem; }
	}
</style>
