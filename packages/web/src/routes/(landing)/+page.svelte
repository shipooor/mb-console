<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import TerrainCanvas from '$lib/components/landing/TerrainCanvas.svelte';

	let terrainSticky = $state(false);

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Hero entrance
		const tl = gsap.timeline();
		tl.to('#l1', { y: '0%', duration: 1.2, ease: 'power4.out' }, 0.2);
		tl.to('#l2', { y: '0%', duration: 1.2, ease: 'power4.out' }, 0.4);
		tl.to('#tagline', { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.9);
		tl.to('#w1', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.2);
		tl.to('#w2', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.35);
		tl.to('#w3', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.5);
		tl.to('#cta', { opacity: 1, duration: 1, ease: 'power2.out' }, 1.8);

		// Scroll reveals
		document.querySelectorAll('.reveal').forEach(el => {
			gsap.to(el, {
				opacity: 1,
				y: 0,
				duration: 0.8,
				ease: 'power3.out',
				scrollTrigger: { trigger: el, start: 'top 85%', once: true }
			});
		});
	});
</script>

<svelte:head>
	<title>MagicBlock Console — CLI, Web & MCP for Solana</title>
	<meta name="description" content="One surface to manage every MagicBlock feature on Solana. Terminal-native CLI, visual web dashboard, and AI-agent MCP server." />
</svelte:head>

<TerrainCanvas bind:isSticky={terrainSticky} />

<!-- Sticky Nav -->
<nav class="nav" class:visible={terrainSticky}>
	<div class="nav-inner">
		<div class="nav-brand">MagicBlock <span>Console</span></div>
		<div class="nav-links">
			<a href="/docs/getting-started">Docs</a>
			<a href="/dashboard">Dashboard</a>
			<a href="https://github.com/shipooor/mb-console" target="_blank" rel="noopener">GitHub</a>
			<a class="nav-cta" href="https://www.npmjs.com/package/@magicblock-console/cli" target="_blank" rel="noopener">npm</a>
		</div>
	</div>
</nav>

<!-- Hero -->
<section class="hero">
	<h1>
		<span class="over"><span class="over-in" id="l1">MagicBlock</span></span>
		<span class="over"><span class="over-in console" id="l2">Console</span></span>
	</h1>

	<p class="tagline" id="tagline">One surface to manage every MagicBlock feature on Solana.</p>

	<div class="ways">
		<div class="way" id="w1">
			<div class="way-icon"><div class="way-dot"></div>CLI</div>
			<div class="way-title">Terminal-native</div>
			<div class="way-desc">Configure everything from your shell</div>
		</div>
		<div class="way" id="w2">
			<div class="way-icon"><div class="way-dot"></div>Web</div>
			<div class="way-title">Visual dashboard</div>
			<div class="way-desc">See and manage all entities in one place</div>
		</div>
		<div class="way featured" id="w3">
			<div class="way-icon"><div class="way-dot"></div>MCP</div>
			<div class="way-title">AI-agent native</div>
			<div class="way-desc">Let your AI configure MagicBlock for you</div>
			<div class="way-badge">new paradigm</div>
		</div>
	</div>

	<div class="hero-cta" id="cta">
		<a class="btn-primary" href="/dashboard">Open dashboard</a>
		<a class="btn-ghost" href="https://www.npmjs.com/package/@magicblock-console/cli" target="_blank" rel="noopener"><span class="prompt">$ </span>npm i -g mb-console</a>
	</div>
</section>

<div class="divider"></div>

<!-- How It Works -->
<section class="content-section">
	<div class="container">
		<div class="reveal">
			<div class="section-label">Three ways in</div>
			<div class="section-title">Pick your interface. <span class="thin">Same power underneath.</span></div>
			<p class="section-sub">Every feature available from CLI, dashboard, and MCP server. Switch between them anytime.</p>
		</div>

		<div class="how-grid reveal">
			<div class="how-card">
				<div class="how-num">01 — CLI</div>
				<h3>Terminal-first</h3>
				<p>Install globally, connect your wallet, and manage everything from the command line. Scripts, CI/CD, automation — it all starts here.</p>
				<div class="code-block"><span class="dim">$</span> <span class="hl">mb-console</span> init
<span class="dim">$</span> <span class="hl">mb-console</span> project list
<span class="dim">$</span> <span class="hl">mb-console</span> er create \
    <span class="hl2">--gasless</span> <span class="hl2">--private</span>
<span class="dim">$</span> <span class="hl">mb-console</span> delegate add \
    <span class="hl2">&lt;program-id&gt;</span></div>
			</div>

			<div class="how-card">
				<div class="how-num">02 — Web Dashboard</div>
				<h3>Visual control</h3>
				<p>See your projects, entities, delegations, and rollups in one place. Toggle features, monitor status, manage access — no terminal needed.</p>
				<div class="code-block"><span class="hl">Projects</span>          <span class="dim">│</span> 3 active
<span class="hl">Entities</span>          <span class="dim">│</span> 12 routed
<span class="hl">Delegations</span>       <span class="dim">│</span> 5 active
<span class="hl">Ephemeral Rollups</span> <span class="dim">│</span> 2 running
<span class="hl">VRF Requests</span>      <span class="dim">│</span> 847 served</div>
			</div>

			<div class="how-card">
				<div class="how-num">03 — MCP Server</div>
				<h3>AI-agent native</h3>
				<p>Connect Claude, Cursor, or any MCP client. Your AI agent gets full access to configure, deploy, and monitor MagicBlock infrastructure.</p>
				<div class="code-block">{@html `<span class="dim">{</span>
  <span class="hl2">"mcpServers"</span>: <span class="dim">{</span>
    <span class="hl">"magicblock"</span>: <span class="dim">{</span>
      <span class="hl2">"command"</span>: <span class="hl">"mb-console"</span>,
      <span class="hl2">"args"</span>: [<span class="hl">"mcp"</span>]
    <span class="dim">}</span>
  <span class="dim">}</span>
<span class="dim">}</span>`}</div>
			</div>
		</div>
	</div>
</section>

<div class="divider"></div>

<!-- Features -->
<section class="content-section">
	<div class="container">
		<div class="reveal">
			<div class="section-label">Features</div>
			<div class="section-title">Everything MagicBlock offers. <span class="thin">One config away.</span></div>
			<p class="section-sub">Each feature toggles on per-project. No code changes, no redeployment.</p>
		</div>

		<div class="features-grid reveal">
			<div class="feature feature-hero">
				<div class="feature-tag tag-green">Gasless</div>
				<h3>Session keys &amp; delegation</h3>
				<p>Players interact without wallet popups. Delegate gas fees to your program. Pure gameplay UX.</p>
			</div>

			<div class="feature feature-hero">
				<div class="feature-tag tag-purple">Ephemeral</div>
				<h3>Dedicated rollups</h3>
				<p>High-frequency logic in isolated runtimes. 50ms ticks. Settle back to Solana when done.</p>
			</div>

			<div class="feature">
				<div class="feature-tag tag-blue">Privacy</div>
				<h3>Confidential state</h3>
				<p>Hide sensitive on-chain data. Player positions, hands, votes — encrypted until revealed.</p>
			</div>

			<div class="feature">
				<div class="feature-tag tag-amber">VRF</div>
				<h3>Verifiable randomness</h3>
				<p>On-chain random numbers with cryptographic proof. Lotteries, loot drops, fair matchmaking.</p>
			</div>

			<div class="feature">
				<div class="feature-tag tag-cyan">Indexing</div>
				<h3>Real-time data</h3>
				<p>Query program state without parsing raw accounts. Structured, fast, always in sync.</p>
			</div>

			<div class="feature">
				<div class="feature-tag tag-rose">Monitor</div>
				<h3>Observability</h3>
				<p>Track entity routing, delegation status, rollup health, and VRF usage from one dashboard.</p>
			</div>
		</div>
	</div>
</section>

<div class="divider"></div>

<!-- Architecture -->
<section class="content-section">
	<div class="container">
		<div class="reveal">
			<div class="section-label">Architecture</div>
			<div class="section-title">One SDK. <span class="thin">Three interfaces.</span></div>
			<p class="section-sub">Everything routes through a shared core. CLI, Web, and MCP are just different entry points to the same engine.</p>
		</div>

		<div class="arch-diagram reveal">
			<div class="arch-box">MagicBlock Console</div>
			<div class="arch-connector"></div>
			<div class="arch-row">
				<div class="arch-branch">
					<div class="arch-branch-line"></div>
					<div class="arch-box-sm">CLI<span>Terminal</span></div>
				</div>
				<div class="arch-branch">
					<div class="arch-branch-line"></div>
					<div class="arch-box-sm">Web<span>Browser</span></div>
				</div>
				<div class="arch-branch">
					<div class="arch-branch-line"></div>
					<div class="arch-box-sm">MCP<span>AI Agent</span></div>
				</div>
			</div>
			<div class="arch-merge-line"></div>
			<div class="arch-box">@magicblock-console/core<span class="arch-sub">SDK: wallet, RPC, config, transactions</span></div>
			<div class="arch-connector"></div>
			<div class="arch-box">MagicBlock Network / Solana</div>
		</div>
	</div>
</section>

<div class="divider"></div>

<!-- Get Started -->
<section class="content-section start-section">
	<div class="container">
		<div class="reveal">
			<div class="section-label">Get started</div>
			<div class="section-title">Up and running <span class="thin">in 30 seconds.</span></div>
			<p class="section-sub center">Pick your path. Everything leads to the same result.</p>
		</div>

		<div class="start-options reveal">
			<div class="start-card">
				<div class="start-card-label">CLI</div>
				<div class="code-block"><span class="dim">$</span> <span class="hl">npm i -g @magicblock-console/cli</span>
<span class="dim">$</span> mb-console init
<span class="dim">$</span> mb-console dashboard</div>
				<p class="start-card-desc">Install, init, open dashboard. Three commands to full control.</p>
			</div>

			<div class="start-card">
				<div class="start-card-label">Web</div>
				<div class="code-block"><span class="hl">mb-console.pages.dev</span>

Connect wallet → select project → go</div>
				<p class="start-card-desc">No install. Open in browser, connect wallet, start managing.</p>
			</div>

			<div class="start-card">
				<div class="start-card-label">MCP</div>
				<div class="code-block"><span class="hl2">"Add mb-console MCP server
 and configure gasless
 for my game project"</span></div>
				<p class="start-card-desc">Tell your AI. It handles the rest via MCP protocol.</p>
			</div>
		</div>
	</div>
</section>

<div class="divider"></div>

<!-- Footer -->
<footer class="footer">
	<div class="container">
		<div class="footer-inner">
			<div class="footer-brand">
				<h4>MagicBlock Console</h4>
				<p>The control plane for Solana's real-time layer.<br>Built for MagicBlock Blitz Hackathon 2026.</p>
			</div>
			<div class="footer-links">
				<div class="footer-col">
					<h5>Product</h5>
					<a href="/docs/getting-started">Documentation</a>
					<a href="/dashboard">Dashboard</a>
					<a href="/docs/cli">CLI Reference</a>
					<a href="/docs/mcp">MCP Server</a>
				</div>
				<div class="footer-col">
					<h5>Packages</h5>
					<a href="https://www.npmjs.com/package/@magicblock-console/cli" target="_blank" rel="noopener">@magicblock-console/cli</a>
					<a href="https://www.npmjs.com/package/@magicblock-console/web" target="_blank" rel="noopener">@magicblock-console/web</a>
					<a href="https://www.npmjs.com/package/@magicblock-console/core" target="_blank" rel="noopener">@magicblock-console/core</a>
				</div>
				<div class="footer-col">
					<h5>Links</h5>
					<a href="https://github.com/shipooor/mb-console" target="_blank" rel="noopener">GitHub</a>
					<a href="https://www.npmjs.com/package/@magicblock-console/core" target="_blank" rel="noopener">npm</a>
					<a href="https://docs.magicblock.gg/" target="_blank" rel="noopener">MagicBlock Docs</a>
				</div>
			</div>
		</div>

		<div class="footer-bottom">
			<span>MagicBlock Console — open source</span>
			<span>Built by <a href="https://github.com/shipooor" target="_blank" rel="noopener">shipooor</a></span>
		</div>
	</div>
</footer>

<style>
	/* ===================== NAV ===================== */
	.nav {
		position: fixed;
		top: 0; left: 0;
		width: 100%;
		z-index: 10;
		padding: 0 24px;
		opacity: 0;
		transform: translateY(-10px);
		pointer-events: none;
		transition: opacity 0.4s ease, transform 0.4s ease;
	}

	.nav.visible {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	.nav-inner {
		max-width: 1080px;
		margin: 0 auto;
		height: 55px;
		padding-top: 12px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.nav-brand {
		font-size: 14px;
		font-weight: 600;
		color: rgba(255,255,255, 0.9);
		letter-spacing: -0.02em;
	}
	.nav-brand span { font-weight: 300; color: rgba(255,255,255, 0.5); }

	.nav-links {
		display: flex;
		align-items: center;
		gap: 24px;
	}
	.nav-links a {
		font-size: 13px;
		color: rgba(255,255,255, 0.9);
		text-decoration: none;
		transition: color 0.2s;
	}
	.nav-links a:hover { color: #fff; }
	.nav-links a.nav-cta {
		font-family: var(--font-mono);
		font-size: 11px;
		padding: 5px 12px;
		border: 1px solid rgba(255,255,255, 0.4);
		border-radius: 5px;
		color: rgba(255,255,255, 0.9);
	}
	.nav-links a.nav-cta:hover { border-color: rgba(255,255,255, 0.7); color: #fff; }

	/* ===================== SECTIONS ===================== */
	:global(section), :global(footer) { position: relative; z-index: 1; }

	.container {
		max-width: 1080px;
		margin: 0 auto;
		padding: 0 24px;
	}

	.section-label {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(139, 92, 246, 0.7);
		margin-bottom: 16px;
	}

	.section-title {
		font-size: clamp(28px, 4vw, 48px);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin-bottom: 16px;
	}
	.section-title .thin { font-weight: 300; color: rgba(255,255,255, 0.55); }

	.section-sub {
		font-size: 16px;
		color: var(--color-text-muted);
		line-height: 1.6;
		max-width: 520px;
		margin-bottom: 48px;
	}
	.section-sub.center { margin-left: auto; margin-right: auto; }

	.divider {
		position: relative;
		z-index: 1;
		height: 1px;
		max-width: 1080px;
		margin: 0 auto;
		background: linear-gradient(90deg, transparent, rgba(139,92,246, 0.15) 30%, rgba(139,92,246, 0.15) 70%, transparent);
	}

	:global(.reveal) { opacity: 0; transform: translateY(30px); }

	.content-section { padding: 15vh 0; }

	/* ===================== HERO ===================== */
	.hero {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 0 24px;
		padding-bottom: 8vh;
	}

	.over { overflow: hidden; display: block; }
	.over-in { display: block; transform: translateY(110%); }

	h1 {
		font-size: clamp(44px, 7vw, 90px);
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: -0.035em;
	}
	h1 .console { font-weight: 300; color: rgba(255,255,255, 0.65); }

	.tagline {
		margin-top: 16px;
		font-size: clamp(15px, 1.5vw, 20px);
		color: rgba(255,255,255, 0.35);
		letter-spacing: -0.01em;
		opacity: 0;
	}

	/* Way cards */
	.ways { display: flex; gap: 12px; margin-top: 48px; }
	.way {
		padding: 16px 24px;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background: var(--color-surface);
		text-align: left;
		min-width: 160px;
		transition: all 0.3s;
		cursor: default;
		opacity: 0;
		transform: translateY(16px);
	}
	.way:hover { border-color: rgba(139,92,246, 0.2); background: rgba(139,92,246, 0.04); }
	.way.featured {
		border-color: rgba(139,92,246, 0.2);
		background: rgba(139,92,246, 0.05);
		position: relative;
	}
	.way.featured::before {
		content: '';
		position: absolute;
		top: -1px; left: 15%; right: 15%;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent);
	}
	.way.featured:hover {
		border-color: rgba(139,92,246, 0.35);
		background: rgba(139,92,246, 0.08);
		box-shadow: 0 4px 24px rgba(139,92,246,0.1);
	}

	.way-icon {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-bottom: 8px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.way-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
	.way:nth-child(1) .way-icon { color: rgba(139,92,246,0.6); }
	.way:nth-child(1) .way-dot { background: #8b5cf6; box-shadow: 0 0 6px rgba(139,92,246,0.4); }
	.way:nth-child(2) .way-icon { color: rgba(99,102,241,0.6); }
	.way:nth-child(2) .way-dot { background: #6366f1; box-shadow: 0 0 6px rgba(99,102,241,0.4); }
	.way:nth-child(3) .way-icon { color: rgba(192,132,252,0.8); }
	.way:nth-child(3) .way-dot { background: #c084fc; box-shadow: 0 0 10px rgba(192,132,252,0.5); }

	.way-title { font-size: 14px; font-weight: 500; color: var(--color-text); margin-bottom: 4px; }
	.way.featured .way-title { color: rgba(255,255,255,0.9); }
	.way-desc { font-size: 12px; color: var(--color-text-muted); line-height: 1.4; }
	.way.featured .way-desc { color: rgba(255,255,255,0.5); }
	.way-badge {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(192,132,252,0.7);
		background: rgba(192,132,252,0.08);
		border: 1px solid rgba(192,132,252,0.15);
		padding: 2px 8px;
		border-radius: 4px;
		margin-top: 8px;
	}

	/* CTA */
	.hero-cta { display: flex; gap: 16px; margin-top: 40px; align-items: center; opacity: 0; }
	.btn-primary {
		font-family: var(--font-mono);
		font-size: 13px;
		padding: 14px 28px;
		background: #7c3aed;
		color: #fff;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s;
		text-decoration: none;
		box-shadow: 0 0 0 1px rgba(124,58,237,0.3), 0 4px 16px rgba(124,58,237,0.2);
	}
	.btn-primary:hover {
		background: #6d28d9;
		box-shadow: 0 0 0 1px rgba(124,58,237,0.5), 0 4px 24px rgba(124,58,237,0.35);
		transform: translateY(-1px);
	}
	.btn-ghost {
		font-family: var(--font-mono);
		font-size: 13px;
		padding: 14px 24px;
		background: var(--color-surface);
		color: rgba(255,255,255,0.25);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s;
		text-decoration: none;
	}
	.btn-ghost:hover { color: rgba(255,255,255,0.5); border-color: rgba(139,92,246,0.2); }
	.btn-ghost .prompt { color: var(--color-text-dim); }

	/* ===================== HOW IT WORKS ===================== */
	.how-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 1px;
		background: var(--color-border);
		border-radius: 16px;
		overflow: hidden;
	}
	.how-card {
		background: var(--color-bg);
		padding: 36px 28px;
		display: flex;
		flex-direction: column;
	}
	.how-card:hover { background: rgba(139,92,246, 0.02); }
	.how-num {
		font-family: var(--font-mono);
		font-size: 11px;
		color: rgba(139,92,246,0.6);
		margin-bottom: 20px;
	}
	.how-card h3 { font-size: 18px; font-weight: 600; margin-bottom: 12px; letter-spacing: -0.02em; }
	.how-card p { font-size: 14px; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 20px; flex: 1; }

	.code-block {
		font-family: var(--font-mono);
		font-size: 12px;
		background: var(--color-code-bg);
		border: 1px solid rgba(255,255,255, 0.04);
		border-radius: 8px;
		padding: 16px;
		color: rgba(255,255,255, 0.5);
		line-height: 1.7;
		overflow-x: hidden;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.code-block :global(.hl) { color: #8b5cf6; }
	.code-block :global(.hl2) { color: #c084fc; }
	.code-block :global(.dim) { color: rgba(255,255,255, 0.3); }

	/* ===================== FEATURES ===================== */
	.features-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.feature {
		padding: 32px;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		background: var(--color-surface);
		transition: all 0.3s;
	}
	.feature.feature-hero {
		padding: 40px;
		border-color: rgba(139,92,246, 0.12);
		background: rgba(139,92,246, 0.03);
	}
	.feature.feature-hero h3 { font-size: 20px; }
	.feature:hover { border-color: rgba(139,92,246,0.15); background: rgba(139,92,246,0.03); }
	.feature-tag {
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 3px 10px;
		border-radius: 4px;
		display: inline-block;
		margin-bottom: 16px;
	}
	.tag-green { color: rgba(52,211,153,0.8); background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.12); }
	.tag-blue { color: rgba(96,165,250,0.8); background: rgba(96,165,250,0.08); border: 1px solid rgba(96,165,250,0.12); }
	.tag-amber { color: rgba(251,191,36,0.8); background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.12); }
	.tag-purple { color: rgba(192,132,252,0.8); background: rgba(192,132,252,0.08); border: 1px solid rgba(192,132,252,0.12); }
	.tag-rose { color: rgba(251,113,133,0.8); background: rgba(251,113,133,0.08); border: 1px solid rgba(251,113,133,0.12); }
	.tag-cyan { color: rgba(34,211,238,0.8); background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.12); }
	.feature h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.01em; }
	.feature p { font-size: 14px; color: var(--color-text-muted); line-height: 1.6; }

	/* ===================== ARCHITECTURE ===================== */
	.arch-diagram {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		padding: 48px 24px;
		background: rgba(0,0,0, 0.3);
		border: 1px solid var(--color-border);
		border-radius: 16px;
	}
	.arch-box {
		font-family: var(--font-mono);
		font-size: 13px;
		text-align: center;
		padding: 16px 32px;
		border: 1px solid rgba(139,92,246, 0.25);
		border-radius: 8px;
		background: rgba(139,92,246, 0.04);
		color: #c084fc;
	}
	.arch-box .arch-sub { display: block; font-size: 11px; color: rgba(255,255,255, 0.45); margin-top: 4px; }
	.arch-connector { width: 1px; height: 32px; background: rgba(139,92,246, 0.2); }
	.arch-row {
		display: flex;
		gap: 24px;
		align-items: stretch;
		position: relative;
	}
	.arch-row::before {
		content: '';
		position: absolute;
		top: 0;
		left: calc(50% - 33.33% + 12px);
		right: calc(50% - 33.33% + 12px);
		height: 1px;
		background: rgba(139,92,246, 0.2);
	}
	.arch-branch { display: flex; flex-direction: column; align-items: center; }
	.arch-branch-line { width: 1px; height: 16px; background: rgba(139,92,246, 0.2); }
	.arch-box-sm {
		font-family: var(--font-mono);
		font-size: 12px;
		text-align: center;
		padding: 12px 24px;
		border: 1px solid rgba(99,102,241, 0.2);
		border-radius: 6px;
		background: rgba(99,102,241, 0.03);
		color: rgba(255,255,255, 0.6);
		min-width: 120px;
	}
	.arch-box-sm span { display: block; font-size: 10px; color: rgba(255,255,255, 0.4); margin-top: 2px; }
	.arch-merge-line { width: 1px; height: 32px; background: rgba(139,92,246, 0.2); }

	/* ===================== GET STARTED ===================== */
	.start-section { text-align: center; }
	.start-options { display: flex; gap: 16px; justify-content: center; margin-top: 40px; flex-wrap: wrap; }
	.start-card {
		padding: 28px 32px;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		background: var(--color-surface);
		text-align: left;
		min-width: 260px;
		max-width: 320px;
		transition: all 0.3s;
	}
	.start-card:hover { border-color: rgba(139,92,246,0.2); background: rgba(139,92,246,0.04); }
	.start-card-label {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(139,92,246,0.5);
		margin-bottom: 12px;
	}
	.start-card .code-block { margin-bottom: 12px; }
	.start-card-desc { font-size: 13px; color: var(--color-text-muted); line-height: 1.5; }

	/* ===================== FOOTER ===================== */
	.footer { padding: 8vh 0 4vh; }
	.footer-inner {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 40px;
		flex-wrap: wrap;
	}
	.footer-brand h4 { font-size: 16px; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.02em; }
	.footer-brand p { font-size: 13px; color: var(--color-text-muted); line-height: 1.5; }
	.footer-links { display: flex; gap: 40px; }
	.footer-col h5 {
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255,255,255,0.3);
		margin-bottom: 12px;
	}
	.footer-col a {
		display: block;
		font-size: 13px;
		color: var(--color-text-muted);
		text-decoration: none;
		padding: 4px 0;
		transition: color 0.2s;
	}
	.footer-col a:hover { color: var(--color-text); }
	.footer-bottom {
		margin-top: 48px;
		padding-top: 24px;
		border-top: 1px solid rgba(255,255,255, 0.03);
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: var(--color-text-dim);
	}
	.footer-bottom a { color: var(--color-text-dim); transition: color 0.2s; }
	.footer-bottom a:hover { color: var(--color-text); }

	/* ===================== RESPONSIVE ===================== */
	@media (max-width: 768px) {
		.ways { flex-direction: column; gap: 8px; }
		.hero-cta { flex-direction: column; }
		.how-grid { grid-template-columns: 1fr; }
		.features-grid { grid-template-columns: 1fr; }
		.start-options { flex-direction: column; align-items: center; }
		.footer-inner { flex-direction: column; }
		.footer-links { flex-direction: column; gap: 24px; }
		.nav-links a:not(.nav-cta) { display: none; }
	}
</style>
