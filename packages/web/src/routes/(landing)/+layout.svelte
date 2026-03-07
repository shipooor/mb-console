<script lang="ts">
	let { children } = $props();
</script>

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

<main>
	{@render children()}
</main>

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
	</div>
	<div class="footer-bottom">
		<p>Built for Solana Blitz Hackathon 2026</p>
	</div>
</footer>

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
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		backdrop-filter: blur(8px);
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
		width: 30px;
		height: 30px;
		background: var(--color-primary);
		color: #fff;
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
		color: var(--color-text-muted);
		transition: color 0.15s ease;
	}

	.nav-links a:hover {
		color: var(--color-heading);
	}

	.nav-cta {
		padding: 0.4rem 1rem;
		background: var(--color-primary);
		color: #fff !important;
		border-radius: var(--radius-md);
		font-size: 0.85rem;
		font-weight: 600;
		transition: background 0.15s ease;
	}

	.nav-cta:hover {
		background: var(--color-primary-hover);
		color: #fff !important;
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
		grid-template-columns: 2fr 1fr 1fr;
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
