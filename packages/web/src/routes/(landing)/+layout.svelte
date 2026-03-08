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
		<p>made with <span class="heart">♥</span> by shipooor — <a href="https://github.com/shipooor" target="_blank" rel="noopener">GitHub</a> · <a href="https://x.com/shipooor" target="_blank" rel="noopener">Twitter</a></p>
	</div>
</footer>
{/if}

<style>
	.navbar {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 2rem;
		height: 60px;
		background: var(--color-navbar-bg);
		border-bottom: 1px solid var(--color-navbar-border);
		backdrop-filter: blur(8px);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--color-navbar-text);
		letter-spacing: -0.01em;
	}

	.logo-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		background: var(--color-primary);
		color: #0c1222;
		border-radius: var(--radius-sm);
		font-size: 0.7rem;
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
		color: rgba(226, 232, 240, 0.7);
		transition: color 0.15s ease;
	}

	.nav-links a:hover {
		color: #ffffff;
	}

	.nav-cta {
		padding: 0.4rem 1rem;
		background: var(--color-primary);
		color: #0c1222 !important;
		border-radius: var(--radius-md);
		font-size: 0.85rem;
		font-weight: 600;
		transition: background 0.15s ease;
	}

	.nav-cta:hover {
		background: var(--color-primary-hover);
		color: #0c1222 !important;
	}

	main {
		min-height: calc(100vh - 60px - 300px);
	}

	.footer {
		background: var(--color-pre-bg);
		color: var(--color-pre-text);
		padding: 3rem 2rem 1.5rem;
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
		color: #fff;
	}

	.footer-section p {
		font-size: 0.85rem;
		color: #94a3b8;
		line-height: 1.6;
	}

	.footer-section a {
		display: block;
		font-size: 0.85rem;
		color: #94a3b8;
		margin-bottom: 0.5rem;
		transition: color 0.15s ease;
	}

	.footer-section a:hover {
		color: var(--color-primary);
	}

	.footer-bottom {
		max-width: 1100px;
		margin: 2rem auto 0;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		text-align: center;
	}

	.footer-bottom p {
		font-size: 0.8rem;
		color: #64748b;
	}

	.heart {
		color: var(--color-primary);
	}

	.footer-bottom a {
		color: #94a3b8;
		transition: color 0.15s ease;
	}

	.footer-bottom a:hover {
		color: var(--color-primary);
	}

	@media (max-width: 768px) {
		.navbar {
			padding: 0 1rem;
		}

		.nav-links {
			gap: 1rem;
		}

		.nav-links a:not(.nav-cta) {
			display: none;
		}

		.footer-content {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}
</style>
