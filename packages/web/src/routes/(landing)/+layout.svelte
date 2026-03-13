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
		<footer class="shipooor-footer">
			<a class="shipooor-link" href="https://shipooor.xyz" target="_blank" rel="noopener">
				<span class="shipooor-stamp-outer">
					<span class="shipooor-stamp-inner">SHIPPED</span>
				</span>
				<span class="shipooor-ft">by <strong>shipooor</strong> · </span>
			</a>
			<a class="shipooor-x" href="https://x.com/shipooor" target="_blank" rel="noopener">X</a>
		</footer>
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

	/* ═══ shipooor footer stamp (from brand kit) ═══ */
	.shipooor-footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		margin-top: 0.5rem;
	}
	.shipooor-link {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		cursor: pointer;
	}
	.shipooor-stamp-outer {
		display: inline-block;
		transform: rotate(-5deg);
		border: 2px solid rgba(255,255,255, 0.7);
		border-radius: 3px;
		padding: 2px;
		position: relative;
		overflow: visible;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}
	.shipooor-stamp-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0.75px solid rgba(255,255,255, 0.4);
		border-radius: 1.5px;
		height: 16px;
		padding: 0 6px;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 8px;
		letter-spacing: 0.1em;
		line-height: 1;
		text-transform: uppercase;
		color: rgba(255,255,255, 0.85);
		position: relative;
		z-index: 1;
		overflow: hidden;
		transition: border-color 0.3s ease;
	}
	.shipooor-stamp-inner::before {
		content: '';
		position: absolute;
		inset: 0;
		background: #fff;
		transform: translateY(100%);
		transition: transform 0.3s cubic-bezier(0.65, 0, 0.35, 1);
		z-index: 0;
	}
	.shipooor-stamp-outer::after {
		content: '';
		position: absolute;
		inset: -3px;
		border-radius: 5px;
		border: 1.5px solid transparent;
		pointer-events: none;
	}
	.shipooor-ft {
		font-family: var(--font-sans);
		font-size: 12px;
		color: rgba(255,255,255, 0.3);
		transition: color 0.3s ease;
	}
	.shipooor-ft strong { color: rgba(255,255,255, 0.45); font-weight: 600; }
	.shipooor-x {
		font-family: var(--font-sans);
		font-size: 12px;
		color: rgba(255,255,255, 0.2);
		text-decoration: none;
		transition: color 0.3s ease;
	}
	.shipooor-link:hover .shipooor-stamp-outer {
		border-color: #fff;
		box-shadow: 0 0 16px rgba(255,255,255, 0.25), 0 0 40px rgba(255,255,255, 0.08);
		animation: shipooor-slam 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.shipooor-link:hover .shipooor-stamp-inner::before { transform: translateY(0); }
	.shipooor-link:hover .shipooor-stamp-inner { border-color: rgba(255,255,255, 0.7); color: #000; }
	.shipooor-link:hover .shipooor-stamp-outer::after { animation: shipooor-ring 0.6s ease-out forwards; }
	.shipooor-link:hover .shipooor-ft,
	.shipooor-link:hover .shipooor-ft strong { color: rgba(255,255,255, 0.8); }
	.shipooor-link:hover ~ .shipooor-x { color: rgba(255,255,255, 0.8); }
	@keyframes shipooor-slam {
		0% { transform: rotate(-5deg) scale(1); }
		15% { transform: rotate(-5deg) scale(1.3) translateY(-6px); }
		35% { transform: rotate(-3deg) scale(0.92) translateY(1px); }
		55% { transform: rotate(-5deg) scale(1.05); }
		100% { transform: rotate(-5deg) scale(1); }
	}
	@keyframes shipooor-ring {
		0% { inset: -3px; border-color: rgba(255,255,255, 0.5); opacity: 1; }
		100% { inset: -16px; border-color: rgba(255,255,255, 0); opacity: 0; }
	}

	@media (max-width: 768px) {
		.navbar { padding: 0 1rem; }
		.nav-links { gap: 1rem; }
		.nav-links a:not(.nav-cta) { display: none; }
		.footer-content { grid-template-columns: 1fr; gap: 1.5rem; }
	}
</style>
