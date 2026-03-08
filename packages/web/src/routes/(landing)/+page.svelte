<svelte:head>
	<title>MagicBlock Console -- Stop managing ERs by hand</title>
	<meta
		name="description"
		content="Developer console for Ephemeral Rollups on Solana. Web dashboard, CLI, and MCP server. One SDK, three interfaces."
	/>
</svelte:head>

<div class="landing">

	<!-- NAV -->
	<nav class="nav">
		<div class="nav-brand">
			<span class="dot"></span>
			MagicBlock Console
		</div>
		<div class="nav-links">
			<a href="/docs">Docs</a>
			<a href="https://github.com/shipooor/mb-console" target="_blank" rel="noopener">GitHub</a>
			<a href="https://www.npmjs.com/package/@magicblock-console/cli" target="_blank" rel="noopener" class="nav-badge">npm</a>
		</div>
	</nav>

	<!-- HERO -->
	<section class="hero">
		<div class="hero-text">
			<h1>Stop managing ERs <span class="highlight">by hand.</span></h1>
			<p class="sub">
				One SDK. Three interfaces. <strong>Web dashboard</strong>, <strong>CLI</strong>, and <strong>MCP server</strong> for Ephemeral Rollups on Solana.
				<br>Delegate, configure, monitor. Done.
			</p>
			<div class="hero-install">
				<code>npm i -g @magicblock-console/cli</code>
				<span class="or">or</span>
				<a href="/dashboard" class="dashboard-link">open dashboard &rarr;</a>
			</div>
		</div>
		<div class="hero-terminal">
			<div class="terminal">
				<div class="terminal-bar">
					<span class="terminal-dot r"></span>
					<span class="terminal-dot y"></span>
					<span class="terminal-dot g"></span>
					<span class="terminal-title">mb-console</span>
				</div>
				<div class="terminal-body">
					<span class="line"><span class="prompt">$ </span><span class="cmd">mb-console project create</span> <span class="value">my-game</span> <span class="flag">--region</span> <span class="value">eu</span></span>
					<span class="line"><span class="success">&#10004;</span><span class="output"> Project "my-game" created (eu)</span></span>
					<span class="line"></span>
					<span class="line"><span class="prompt">$ </span><span class="cmd">mb-console project configure</span> <span class="value">my-game</span> <span class="flag">--gasless --vrf --oracle</span></span>
					<span class="line"><span class="output">  gasless: </span><span class="success">enabled</span></span>
					<span class="line"><span class="output">  vrf:     </span><span class="success">enabled</span></span>
					<span class="line"><span class="output">  oracle:  </span><span class="success">enabled</span></span>
					<span class="line"></span>
					<span class="line"><span class="prompt">$ </span><span class="cmd">mb-console er delegate</span> <span class="value">7xKX...9mPq</span> <span class="flag">--project</span> <span class="value">my-game</span></span>
					<span class="line"><span class="success">&#10004;</span><span class="output"> Account 7xKX...9mPq delegated to ER</span></span>
					<span class="line"><span class="output">  validator:  devnet-eu.magicblock.app</span></span>
					<span class="line"><span class="output">  tx:         </span><span class="key">4sGjM...wKp2</span></span>
					<span class="line"></span>
					<span class="line"><span class="prompt">$ </span><span class="cmd">mb-console oracle price</span> <span class="flag">--feed</span> <span class="value">SOL/USD</span> <span class="flag">--project</span> <span class="value">my-game</span></span>
					<span class="line"><span class="output">  feed:   SOL/USD</span></span>
					<span class="line"><span class="output">  price:  </span><span class="num">$168.42</span></span>
					<span class="line"><span class="output">  conf:   </span><span class="num">&#177;0.12</span></span>
					<span class="line"><span class="output">  slot:   </span><span class="num">312847561</span></span>
				</div>
			</div>
		</div>
	</section>

	<!-- DIVIDER -->
	<div class="divider"></div>

	<!-- THREE WAYS IN -->
	<section class="ways">
		<div class="ways-header">
			<h2>Three ways <span class="accent">in.</span></h2>
			<p>Same core SDK underneath. Pick your interface.</p>
		</div>

		<!-- CLI -->
		<div class="way">
			<div class="way-inner">
				<div class="way-meta">
					<span class="way-label cli">CLI</span>
					<h3>Terminal-native</h3>
					<p>For scripting, CI/CD, and developers who think faster in a terminal. Every feature is a command. Pipe it, script it, cron it.</p>
				</div>
				<div class="way-code">
					<div class="terminal">
						<div class="terminal-bar">
							<span class="terminal-dot r"></span>
							<span class="terminal-dot y"></span>
							<span class="terminal-dot g"></span>
							<span class="terminal-title">terminal</span>
						</div>
						<div class="terminal-body">
							<span class="line"><span class="prompt">$ </span><span class="cmd">mb-console vrf request</span> <span class="flag">--project</span> <span class="value">my-game</span></span>
							<span class="line"><span class="success">&#10004;</span><span class="output"> VRF randomness requested</span></span>
							<span class="line"><span class="output">  value:    </span><span class="num">0xae3f...c891</span></span>
							<span class="line"><span class="output">  latency:  </span><span class="num">94ms</span></span>
							<span class="line"></span>
							<span class="line"><span class="prompt">$ </span><span class="cmd">mb-console crank create</span> <span class="flag">--project</span> <span class="value">my-game</span> <span class="flag">--interval</span> <span class="value">5000</span> <span class="flag">--iterations</span> <span class="value">100</span></span>
							<span class="line"><span class="success">&#10004;</span><span class="output"> Crank created</span></span>
							<span class="line"><span class="output">  id:          </span><span class="key">crank_8f2a</span></span>
							<span class="line"><span class="output">  interval:    </span><span class="num">5000ms</span></span>
							<span class="line"><span class="output">  iterations:  </span><span class="num">100</span></span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- WEB -->
		<div class="way">
			<div class="way-inner">
				<div class="way-meta">
					<span class="way-label web">Web Dashboard</span>
					<h3>Visual control</h3>
					<p>Connect your wallet, toggle features, monitor state. For when you want to see what's happening, not read JSON output.</p>
				</div>
				<div class="way-code">
					<div class="terminal" style="border-color: var(--accent2);">
						<div class="terminal-bar">
							<span class="terminal-dot r"></span>
							<span class="terminal-dot y"></span>
							<span class="terminal-dot g"></span>
							<span class="terminal-title">mb-console.pages.dev/dashboard</span>
						</div>
						<div class="terminal-body">
							<span class="line"><span class="output">  ER Lifecycle</span></span>
							<span class="line"><span class="output">  ├── Delegate accounts with one click</span></span>
							<span class="line"><span class="output">  ├── Configure gasless, VRF, privacy, cranks, oracle</span></span>
							<span class="line"><span class="output">  ├── Real-time delegation status</span></span>
							<span class="line"><span class="output">  └── Commit / undelegate controls</span></span>
							<span class="line"></span>
							<span class="line"><span class="output">  Monitor</span></span>
							<span class="line"><span class="output">  ├── Live validator health</span></span>
							<span class="line"><span class="output">  ├── Transaction throughput</span></span>
							<span class="line"><span class="output">  └── Region latency (US / EU / Asia)</span></span>
							<span class="line"></span>
							<span class="line"><span class="key">  &rarr; </span><span class="output">No backend. SDK talks to MagicBlock directly.</span></span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- MCP -->
		<div class="way">
			<div class="way-inner">
				<div class="way-meta">
					<span class="way-label mcp">MCP Server</span>
					<h3>AI-agent native</h3>
					<p>Drop this into Claude, Cursor, or any MCP client. Your AI manages infrastructure. Seriously.</p>
				</div>
				<div class="way-code">
					<div class="terminal" style="border-color: #f59e0b;">
						<div class="terminal-bar">
							<span class="terminal-dot r"></span>
							<span class="terminal-dot y"></span>
							<span class="terminal-dot g"></span>
							<span class="terminal-title">claude_desktop_config.json</span>
						</div>
						<div class="terminal-body">
							<span class="line">&#123;</span>
							<span class="line">  <span class="key">"mcpServers"</span>: &#123;</span>
							<span class="line">    <span class="key">"magicblock-console"</span>: &#123;</span>
							<span class="line">      <span class="key">"command"</span>: <span class="str">"npx"</span>,</span>
							<span class="line">      <span class="key">"args"</span>: [<span class="str">"@magicblock-console/mcp"</span>],</span>
							<span class="line">      <span class="key">"env"</span>: &#123;</span>
							<span class="line">        <span class="key">"MB_KEYPAIR_PATH"</span>: <span class="str">"~/.config/solana/id.json"</span></span>
							<span class="line">      &#125;</span>
							<span class="line">    &#125;</span>
							<span class="line">  &#125;</span>
							<span class="line">&#125;</span>
							<span class="line"></span>
							<span class="line"><span class="comment">// 22 tools: create_project, delegate_account,</span></span>
							<span class="line"><span class="comment">// request_vrf, get_price_feed, create_crank...</span></span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- DIVIDER -->
	<div class="divider"></div>

	<!-- FEATURES -->
	<section class="features">
		<div class="features-header">
			<h2>What you get.</h2>
			<p>Every MagicBlock ER feature. Managed, not coded.</p>
		</div>
		<div class="features-list">
			<div class="feature-item">
				<span class="feature-tag green">GASLESS</span>
				<div class="feature-content">
					<h4>Zero-fee transactions on ER</h4>
					<p>Toggle per project. Users sign, they don't pay. ER validator subsidizes compute.</p>
				</div>
			</div>
			<div class="feature-item">
				<span class="feature-tag blue">PRIVACY</span>
				<div class="feature-content">
					<h4>TEE-backed private execution</h4>
					<p>Deposit, transfer, withdraw through MagicBlock's PER API. State hidden inside trusted hardware.</p>
				</div>
			</div>
			<div class="feature-item">
				<span class="feature-tag amber">VRF</span>
				<div class="feature-content">
					<h4>Verifiable randomness in ~100ms</h4>
					<p>On-chain VRF on the ER. Free. Sub-second. No oracle fees, no waiting for callbacks.</p>
				</div>
			</div>
			<div class="feature-item">
				<span class="feature-tag green">CRANKS</span>
				<div class="feature-content">
					<h4>Scheduled auto-execution</h4>
					<p>Set interval and iterations. The ER cranks your program automatically. No keeper bots needed.</p>
				</div>
			</div>
			<div class="feature-item">
				<span class="feature-tag blue">ORACLE</span>
				<div class="feature-content">
					<h4>Pyth price feeds on ER</h4>
					<p>SOL/USD, BTC/USD, ETH/USD available on-chain in the ephemeral rollup. Real prices, no bridge.</p>
				</div>
			</div>
			<div class="feature-item">
				<span class="feature-tag amber">MONITOR</span>
				<div class="feature-content">
					<h4>Live validator health and status</h4>
					<p>Region latency, slot height, transaction throughput. See your ER breathe in real time.</p>
				</div>
			</div>
			<div class="feature-item">
				<span class="feature-tag green">DELEGATION</span>
				<div class="feature-content">
					<h4>Full lifecycle control</h4>
					<p>Delegate, execute, commit, undelegate. Across three regions. One command or one click.</p>
				</div>
			</div>
			<div class="feature-item">
				<span class="feature-tag blue">ZERO BACKEND</span>
				<div class="feature-content">
					<h4>No server between you and Solana</h4>
					<p>Core SDK talks directly to MagicBlock APIs and Solana RPC. Your keys, your connection, no middleman.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- ARCHITECTURE -->
	<section class="arch">
		<h2>Architecture.</h2>
		<div class="arch-diagram"><span class="hl2">Web Dashboard</span>  ──┐
                     │
<span class="hl">CLI</span>              ──┼──  <span class="hl">@magicblock-console/core</span>  ──  <span class="hl3">MagicBlock ER</span>
                     │          │                         <span class="hl3">Solana Devnet</span>
<span class="hl3">MCP Server</span>       ──┘          │
                          ┌─────┴─────┐
                          │           │
                     Projects    Features
                     Storage     ├── Gasless
                     Auth        ├── Privacy (TEE)
                                 ├── VRF
                                 ├── Cranks
                                 ├── Oracle (Pyth)
                                 └── Session Keys</div>
	</section>

	<!-- INSTALL -->
	<section class="install">
		<div class="install-inner">
			<h2>Ready when you are.</h2>
			<p class="tagline">Solana devnet. Works right now. No API keys, no signup.</p>
			<div class="install-cmd">npm i -g @magicblock-console/cli</div>
			<p class="install-after">
				Then run <code class="inline-code">mb-console --help</code>
				&nbsp;&middot;&nbsp;
				<a href="/docs">Read the docs</a>
				&nbsp;&middot;&nbsp;
				<a href="/dashboard">Open dashboard</a>
			</p>
		</div>
	</section>

	<!-- FOOTER -->
	<footer class="landing-footer">
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
			<p>made with <span class="heart">&hearts;</span> by shipooor &mdash; <a href="https://github.com/shipooor" target="_blank" rel="noopener">GitHub</a> &middot; <a href="https://x.com/shipooor" target="_blank" rel="noopener">Twitter</a></p>
		</div>
	</footer>

</div>

<style>
	/* ==================== SCOPED VARIABLES ==================== */
	.landing {
		--bg: #0c1222;
		--bg-raised: #111a2e;
		--bg-surface: #162036;
		--bg-alt: #0a0f1a;
		--text: #e2e8f0;
		--text-muted: #64748b;
		--text-dim: #475569;
		--accent: #14f195;
		--accent-dim: rgba(20, 241, 149, 0.15);
		--accent2: #00d4ff;
		--accent2-dim: rgba(0, 212, 255, 0.1);
		--border: #1e293b;
		--border-accent: #14f195;
		--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
		--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

		background: var(--bg);
		color: var(--text);
		font-family: var(--font-sans);
		line-height: 1.6;
		overflow-x: hidden;
	}

	.landing a {
		color: inherit;
		text-decoration: none;
	}

	/* ==================== NAV ==================== */
	.nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(12, 18, 34, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border);
		padding: 0 32px;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nav-brand {
		font-weight: 800;
		font-size: 1rem;
		letter-spacing: -0.02em;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.nav-brand .dot {
		width: 8px;
		height: 8px;
		background: var(--accent);
		border-radius: 2px;
		display: inline-block;
	}

	.nav-links {
		display: flex;
		gap: 24px;
		align-items: center;
	}

	.nav-links a {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-muted);
		transition: color 0.15s;
	}

	.nav-links a:hover {
		color: var(--text);
	}

	.nav-links .nav-badge {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--accent);
		border: 1px solid rgba(20, 241, 149, 0.3);
		padding: 2px 8px;
		border-radius: 4px;
		letter-spacing: 0.02em;
	}

	/* ==================== HERO ==================== */
	.hero {
		padding: 100px 32px 80px;
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		gap: 64px;
		align-items: center;
	}

	.hero-text h1 {
		font-size: 4.5rem;
		font-weight: 900;
		line-height: 1.05;
		letter-spacing: -0.04em;
		margin-bottom: 24px;
	}

	.hero-text h1 .highlight {
		color: var(--accent);
	}

	.hero-text .sub {
		font-size: 1.25rem;
		color: var(--text-muted);
		line-height: 1.5;
		max-width: 440px;
		margin-bottom: 40px;
	}

	.hero-text .sub strong {
		color: var(--text);
		font-weight: 600;
	}

	.hero-install {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
	}

	.hero-install code {
		font-family: var(--font-mono);
		font-size: 1rem;
		background: var(--bg-raised);
		border: 2px solid var(--border-accent);
		padding: 12px 20px;
		border-radius: 6px;
		color: var(--accent);
		user-select: all;
		cursor: pointer;
		transition: background 0.15s;
		white-space: nowrap;
	}

	.hero-install code:hover {
		background: var(--accent-dim);
	}

	.hero-install .or {
		color: var(--text-dim);
		font-size: 0.875rem;
	}

	.hero-install .dashboard-link {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--accent2);
		border-bottom: 1px solid transparent;
		transition: border-color 0.15s;
		white-space: nowrap;
	}

	.hero-install .dashboard-link:hover {
		border-bottom-color: var(--accent2);
	}

	/* Terminal */
	.terminal {
		background: #0a0e18;
		border: 2px solid var(--border-accent);
		border-radius: 8px;
		overflow: hidden;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.7;
		box-shadow: 0 0 60px rgba(20, 241, 149, 0.06);
	}

	.terminal-bar {
		background: #111827;
		padding: 10px 16px;
		display: flex;
		align-items: center;
		gap: 8px;
		border-bottom: 1px solid var(--border);
	}

	.terminal-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.terminal-dot.r { background: #ef4444; }
	.terminal-dot.y { background: #eab308; }
	.terminal-dot.g { background: #22c55e; }

	.terminal-title {
		margin-left: 8px;
		color: var(--text-dim);
		font-size: 0.75rem;
	}

	.terminal-body {
		padding: 20px;
		overflow-x: auto;
	}

	.terminal-body .line {
		display: block;
		white-space: pre;
	}

	.terminal-body .prompt {
		color: var(--accent);
	}

	.terminal-body .cmd {
		color: var(--text);
	}

	.terminal-body .flag {
		color: var(--accent2);
	}

	.terminal-body .value {
		color: #f59e0b;
	}

	.terminal-body .output {
		color: var(--text-muted);
	}

	.terminal-body .success {
		color: var(--accent);
	}

	.terminal-body .key {
		color: var(--accent2);
	}

	.terminal-body .str {
		color: #f59e0b;
	}

	.terminal-body .num {
		color: #a78bfa;
	}

	.terminal-body .comment {
		color: var(--text-dim);
		font-style: italic;
	}

	/* ==================== DIVIDER ==================== */
	.divider {
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent);
		margin: 0;
		opacity: 0.5;
	}

	/* ==================== THREE WAYS ==================== */
	.ways {
		padding: 80px 0 0;
	}

	.ways-header {
		padding: 0 32px;
		max-width: 1200px;
		margin: 0 auto 48px;
	}

	.ways-header h2 {
		font-size: 2.5rem;
		font-weight: 800;
		letter-spacing: -0.03em;
	}

	.ways-header h2 .accent {
		color: var(--accent);
	}

	.ways-header p {
		color: var(--text-muted);
		font-size: 1.1rem;
		margin-top: 8px;
	}

	.way {
		border-top: 1px solid var(--border);
		padding: 56px 32px;
		transition: background 0.2s;
	}

	.way:hover {
		background: rgba(20, 241, 149, 0.02);
	}

	.way:nth-child(odd) {
		background: var(--bg-alt);
	}

	.way:nth-child(odd):hover {
		background: rgba(10, 15, 26, 0.9);
	}

	.way-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 48px;
		align-items: start;
	}

	.way-meta {
		position: sticky;
		top: 80px;
	}

	.way-label {
		display: inline-block;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		padding: 4px 10px;
		border-radius: 3px;
		margin-bottom: 16px;
	}

	.way-label.cli {
		color: var(--accent);
		background: var(--accent-dim);
		border: 1px solid rgba(20, 241, 149, 0.25);
	}

	.way-label.web {
		color: var(--accent2);
		background: var(--accent2-dim);
		border: 1px solid rgba(0, 212, 255, 0.25);
	}

	.way-label.mcp {
		color: #f59e0b;
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid rgba(245, 158, 11, 0.25);
	}

	.way-meta h3 {
		font-size: 1.75rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		margin-bottom: 12px;
	}

	.way-meta p {
		color: var(--text-muted);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.way-code {
		min-width: 0;
	}

	.way-code .terminal {
		border-width: 2px;
	}

	.way:nth-child(1) .way-code .terminal { border-color: var(--accent); }
	.way:nth-child(2) .way-code .terminal { border-color: var(--accent2); }
	.way:nth-child(3) .way-code .terminal { border-color: #f59e0b; }

	/* ==================== FEATURES ==================== */
	.features {
		padding: 96px 32px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.features-header {
		margin-bottom: 64px;
	}

	.features-header h2 {
		font-size: 3rem;
		font-weight: 900;
		letter-spacing: -0.03em;
		margin-bottom: 12px;
	}

	.features-header p {
		color: var(--text-muted);
		font-size: 1.1rem;
	}

	.features-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
	}

	.feature-item {
		padding: 32px 0;
		border-top: 1px solid var(--border);
		display: flex;
		gap: 16px;
		align-items: flex-start;
	}

	.feature-item:nth-child(odd) {
		padding-right: 48px;
		border-right: 1px solid var(--border);
	}

	.feature-item:nth-child(even) {
		padding-left: 48px;
	}

	/* Stagger effect: even items pushed down */
	.feature-item:nth-child(2) {
		margin-top: 48px;
	}

	.feature-tag {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		white-space: nowrap;
		padding: 4px 8px;
		border-radius: 3px;
		letter-spacing: 0.02em;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.feature-tag.green {
		color: var(--accent);
		background: var(--accent-dim);
	}

	.feature-tag.blue {
		color: var(--accent2);
		background: var(--accent2-dim);
	}

	.feature-tag.amber {
		color: #f59e0b;
		background: rgba(245, 158, 11, 0.1);
	}

	.feature-content h4 {
		font-size: 1.1rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		margin-bottom: 4px;
	}

	.feature-content p {
		color: var(--text-muted);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	/* ==================== INSTALL ==================== */
	.install {
		background: var(--bg-alt);
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		padding: 80px 32px;
		text-align: center;
	}

	.install-inner {
		max-width: 800px;
		margin: 0 auto;
	}

	.install h2 {
		font-size: 2rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		margin-bottom: 8px;
	}

	.install .tagline {
		color: var(--text-muted);
		font-size: 1rem;
		margin-bottom: 40px;
	}

	.install-cmd {
		font-family: var(--font-mono);
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--accent);
		background: var(--bg);
		border: 3px solid var(--border-accent);
		padding: 24px 40px;
		border-radius: 8px;
		display: inline-block;
		user-select: all;
		cursor: pointer;
		transition: background 0.15s, box-shadow 0.15s;
		letter-spacing: -0.02em;
	}

	.install-cmd:hover {
		background: var(--accent-dim);
		box-shadow: 0 0 40px rgba(20, 241, 149, 0.08);
	}

	.install-after {
		margin-top: 24px;
		color: var(--text-dim);
		font-size: 0.85rem;
	}

	.install-after .inline-code {
		font-family: var(--font-mono);
		color: var(--accent);
		background: none;
		padding: 0;
		border: none;
	}

	.install-after a {
		color: var(--accent2);
		border-bottom: 1px dashed var(--accent2);
	}

	.install-after a:hover {
		border-bottom-style: solid;
	}

	/* ==================== ARCH ==================== */
	.arch {
		padding: 96px 32px;
		max-width: 1000px;
		margin: 0 auto;
	}

	.arch h2 {
		font-size: 2rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		margin-bottom: 48px;
	}

	.arch-diagram {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		line-height: 1.7;
		color: var(--text-muted);
		background: var(--bg-alt);
		border: 2px solid var(--border);
		border-radius: 8px;
		padding: 32px;
		overflow-x: auto;
		white-space: pre;
	}

	.arch-diagram .hl {
		color: var(--accent);
		font-weight: 600;
	}

	.arch-diagram .hl2 {
		color: var(--accent2);
		font-weight: 600;
	}

	.arch-diagram .hl3 {
		color: #f59e0b;
		font-weight: 600;
	}

	/* ==================== FOOTER ==================== */
	.landing-footer {
		border-top: 1px solid var(--border);
		padding: 3rem 2rem 1.5rem;
		background: var(--bg-alt);
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
		color: var(--text);
	}

	.footer-section p {
		font-size: 0.85rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.footer-section a {
		display: block;
		font-size: 0.85rem;
		color: var(--text-muted);
		margin-bottom: 0.5rem;
		transition: color 0.15s;
	}

	.footer-section a:hover {
		color: var(--accent);
	}

	.footer-bottom {
		max-width: 1100px;
		margin: 2rem auto 0;
		padding-top: 1.25rem;
		border-top: 1px solid var(--border);
		text-align: center;
	}

	.footer-bottom p {
		font-size: 0.8rem;
		color: var(--text-dim);
	}

	.footer-bottom a {
		color: var(--text-muted);
		transition: color 0.15s;
	}

	.footer-bottom a:hover {
		color: var(--accent);
	}

	.heart {
		color: var(--accent);
	}

	/* ==================== RESPONSIVE ==================== */
	@media (max-width: 960px) {
		.hero {
			grid-template-columns: 1fr;
			padding: 64px 24px 48px;
			gap: 40px;
		}

		.hero-text h1 {
			font-size: 3rem;
		}

		.way-inner {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.way-meta {
			position: static;
		}

		.features-list {
			grid-template-columns: 1fr;
		}

		.feature-item:nth-child(odd) {
			padding-right: 0;
			border-right: none;
		}

		.feature-item:nth-child(even) {
			padding-left: 0;
		}

		.feature-item:nth-child(2) {
			margin-top: 0;
		}

		.install-cmd {
			font-size: 1.1rem;
			padding: 16px 24px;
		}

		.features-header h2 {
			font-size: 2rem;
		}

		.footer-content {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 600px) {
		.hero-text h1 {
			font-size: 2.25rem;
		}

		.hero-text .sub {
			font-size: 1rem;
		}

		.hero-install {
			flex-direction: column;
			align-items: flex-start;
		}

		.nav {
			padding: 0 16px;
		}

		.ways-header h2 {
			font-size: 1.75rem;
		}

		.install-cmd {
			font-size: 0.9rem;
			padding: 14px 18px;
			word-break: break-all;
		}

		.footer-content {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.footer-bottom {
			text-align: center;
		}

		.arch-diagram {
			font-size: 0.65rem;
			padding: 16px;
		}
	}
</style>
