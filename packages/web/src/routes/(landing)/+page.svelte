<svelte:head>
	<title>MagicBlock Console -- Developer Console for Ephemeral Rollups</title>
	<meta
		name="description"
		content="One console for all MagicBlock features. Manage Ephemeral Rollups through Web, CLI, or AI agents via MCP."
	/>
</svelte:head>

<!-- Hero -->
<section class="hero">
	<div class="hero-bg"></div>
	<div class="hero-content">
		<span class="hero-badge">Solana Blitz Hackathon 2026</span>
		<h1>MagicBlock Console</h1>
		<p class="hero-subtitle">
			The unified developer console for managing
			<strong>Ephemeral Rollups</strong> on Solana. One SDK, three interfaces -- Web, CLI, and MCP.
		</p>
		<div class="hero-actions">
			<a href="/dashboard" class="btn btn-primary">Open Dashboard</a>
			<a href="/docs/getting-started" class="btn btn-secondary">Read Docs</a>
		</div>
		<div class="hero-code">
			<div class="code-header">
				<span class="code-dot"></span>
				<span class="code-dot"></span>
				<span class="code-dot"></span>
				<span class="code-title">Terminal</span>
			</div>
			<pre><code><span class="code-prompt">$</span> mb-console project create my-game --region eu
<span class="code-success">Project "my-game" created (region: eu)</span>

<span class="code-prompt">$</span> mb-console er delegate TokenkegQ...EE5 \
    --project my-game

<span class="code-comment"># Account delegated to Ephemeral Rollup</span>
<span class="code-success">Validator:</span>  devnet-eu.magicblock.app
<span class="code-success">Signature:</span>  4sGj...kP2m</code></pre>
		</div>
	</div>
</section>

<!-- Three Interfaces -->
<section class="section">
	<div class="container">
		<div class="section-header">
			<h2>One SDK, Three Interfaces</h2>
			<p>Choose the interface that fits your workflow. Same core engine, different access patterns.</p>
		</div>
		<div class="interfaces-grid">
			<div class="interface-card">
				<div class="interface-icon">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
						<line x1="8" y1="21" x2="16" y2="21"/>
						<line x1="12" y1="17" x2="12" y2="21"/>
					</svg>
				</div>
				<h3>Web Dashboard</h3>
				<p>Visual management interface with real-time monitoring, ER lifecycle controls, and session analytics.</p>
				<div class="interface-example">
					<code>localhost:5173/dashboard</code>
				</div>
				<a href="/dashboard" class="interface-link">Open Dashboard</a>
			</div>

			<div class="interface-card">
				<div class="interface-icon">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="4 17 10 11 4 5"/>
						<line x1="12" y1="19" x2="20" y2="19"/>
					</svg>
				</div>
				<h3>CLI</h3>
				<p>Full-featured command-line tool for scripting, CI/CD integration, and rapid development workflows.</p>
				<div class="interface-example">
					<code>mb-console er list --project my-game</code>
				</div>
				<a href="/docs/cli" class="interface-link">CLI Reference</a>
			</div>

			<div class="interface-card">
				<div class="interface-icon">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 2L2 7l10 5 10-5-10-5z"/>
						<path d="M2 17l10 5 10-5"/>
						<path d="M2 12l10 5 10-5"/>
					</svg>
				</div>
				<h3>MCP Server</h3>
				<p>Model Context Protocol integration lets AI agents manage ERs through natural language via Claude, Cursor, and others.</p>
				<div class="interface-example">
					<code>"Create an ER for my game"</code>
				</div>
				<a href="/docs/mcp" class="interface-link">MCP Reference</a>
			</div>
		</div>
	</div>
</section>

<!-- Features Grid -->
<section class="section section-alt">
	<div class="container">
		<div class="section-header">
			<h2>Built-In Features</h2>
			<p>Every MagicBlock feature accessible through a single, unified API.</p>
		</div>
		<div class="features-grid">
			<div class="feature-card">
				<div class="feature-icon">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
					</svg>
				</div>
				<h3>Gasless Transactions</h3>
				<p>Execute transactions without gas fees inside Ephemeral Rollups. Users interact seamlessly with no wallet popups.</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
						<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
					</svg>
				</div>
				<h3>Privacy</h3>
				<p>Run computations in private Ephemeral Rollups. State is hidden until committed back to Solana mainnet.</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
						<polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
						<polyline points="7.5 19.79 7.5 14.6 3 12"/>
						<polyline points="21 12 16.5 14.6 16.5 19.79"/>
						<polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
						<line x1="12" y1="22.08" x2="12" y2="12"/>
					</svg>
				</div>
				<h3>VRF (Verifiable Random)</h3>
				<p>On-chain verifiable randomness for games, lotteries, and any logic requiring provably fair random values.</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="3"/>
						<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
					</svg>
				</div>
				<h3>Automated Cranks</h3>
				<p>Schedule periodic on-chain actions. Game ticks, settlement cycles, and maintenance tasks run automatically.</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/>
						<line x1="2" y1="12" x2="22" y2="12"/>
						<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
					</svg>
				</div>
				<h3>Oracle Integration</h3>
				<p>Feed external data into Ephemeral Rollups. Price feeds, weather data, sports scores -- any off-chain data source.</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
					</svg>
				</div>
				<h3>Monitoring</h3>
				<p>Real-time dashboards for ER health, transaction throughput, account state diffs, and session lifecycle events.</p>
			</div>
		</div>
	</div>
</section>

<!-- Architecture -->
<section class="section">
	<div class="container">
		<div class="section-header">
			<h2>Architecture</h2>
			<p>A shared Core SDK powers all three interfaces. Your choice of frontend, same capabilities underneath.</p>
		</div>
		<div class="architecture">
			<pre class="arch-diagram"><code>                    +---------------------+
                    |    MagicBlock API    |
                    | (Ephemeral Rollups)  |
                    +----------+----------+
                               |
                    +----------+----------+
                    |      Core SDK       |
                    |  TypeScript / Node  |
                    +--+-------+-------+--+
                       |       |       |
              +--------+  +---+---+  +---------+
              |           |       |            |
        +-----+----+ +---+---+ +-+----------+ |
        | Web App  | |  CLI  | | MCP Server | |
        | SvelteKit| |Commander| | stdio/SSE  | |
        +----------+ +-------+ +------------+ </code></pre>
			<div class="arch-labels">
				<div class="arch-label">
					<span class="arch-dot arch-dot-web"></span>
					<div>
						<strong>Web Dashboard</strong>
						<span>SvelteKit app with real-time UI</span>
					</div>
				</div>
				<div class="arch-label">
					<span class="arch-dot arch-dot-cli"></span>
					<div>
						<strong>CLI</strong>
						<span>Commander.js-based command-line tool</span>
					</div>
				</div>
				<div class="arch-label">
					<span class="arch-dot arch-dot-mcp"></span>
					<div>
						<strong>MCP Server</strong>
						<span>AI agent integration via Model Context Protocol</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Getting Started -->
<section class="section section-alt">
	<div class="container">
		<div class="section-header">
			<h2>Get Started in 3 Steps</h2>
			<p>From zero to managing Ephemeral Rollups in under a minute.</p>
		</div>
		<div class="steps">
			<div class="step">
				<div class="step-number">1</div>
				<div class="step-content">
					<h3>Install</h3>
					<pre><code><span class="code-prompt">$</span> npm install -g @magicblock-console/cli</code></pre>
				</div>
			</div>
			<div class="step-connector"></div>
			<div class="step">
				<div class="step-number">2</div>
				<div class="step-content">
					<h3>Create Project</h3>
					<pre><code><span class="code-prompt">$</span> mb-console project create my-game \
    --region us

<span class="code-success">Project "my-game" created (region: us)</span></code></pre>
				</div>
			</div>
			<div class="step-connector"></div>
			<div class="step">
				<div class="step-number">3</div>
				<div class="step-content">
					<h3>Delegate</h3>
					<pre><code><span class="code-prompt">$</span> mb-console er delegate GameState111...xxx \
    --project my-game

<span class="code-success">Account GameState111...xxx delegated</span></code></pre>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="section section-cta">
	<div class="container">
		<h2>Ready to build?</h2>
		<p>Open the dashboard or dive into the documentation to get started.</p>
		<div class="cta-actions">
			<a href="/dashboard" class="btn btn-primary btn-lg">Open Dashboard</a>
			<a href="/docs/getting-started" class="btn btn-secondary btn-lg">Getting Started Guide</a>
		</div>
	</div>
</section>

<style>
	/* ---- Hero ---- */
	.hero {
		position: relative;
		padding: 5rem 2rem 4rem;
		text-align: center;
		overflow: hidden;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 70%),
			linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%);
		z-index: 0;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		max-width: 720px;
		margin: 0 auto;
	}

	.hero-badge {
		display: inline-block;
		padding: 0.3rem 0.9rem;
		background: rgba(139, 92, 246, 0.1);
		color: var(--color-primary);
		border: 1px solid rgba(139, 92, 246, 0.2);
		border-radius: 100px;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		margin-bottom: 1.25rem;
	}

	.hero h1 {
		font-size: 3rem;
		font-weight: 700;
		color: var(--color-heading);
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin-bottom: 1rem;
	}

	.hero-subtitle {
		font-size: 1.15rem;
		color: var(--color-text-muted);
		line-height: 1.7;
		max-width: 560px;
		margin: 0 auto 2rem;
	}

	.hero-subtitle strong {
		color: var(--color-heading);
		font-weight: 600;
	}

	.hero-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		margin-bottom: 3rem;
	}

	/* ---- Buttons ---- */
	.btn {
		display: inline-flex;
		align-items: center;
		padding: 0.65rem 1.5rem;
		border-radius: var(--radius-md);
		font-size: 0.9rem;
		font-weight: 600;
		transition: all 0.15s ease;
		cursor: pointer;
		border: none;
	}

	.btn-primary {
		background: var(--color-primary);
		color: #fff;
	}

	.btn-primary:hover {
		background: var(--color-primary-hover);
	}

	.btn-secondary {
		background: var(--color-surface);
		color: var(--color-heading);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.btn-lg {
		padding: 0.8rem 2rem;
		font-size: 0.95rem;
	}

	/* ---- Hero Code Block ---- */
	.hero-code {
		max-width: 520px;
		margin: 0 auto;
		text-align: left;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
	}

	.code-header {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 0.6rem 1rem;
		background: #1e293b;
	}

	.code-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #475569;
	}

	.code-dot:first-child {
		background: #ef4444;
	}

	.code-dot:nth-child(2) {
		background: #f59e0b;
	}

	.code-dot:nth-child(3) {
		background: #10b981;
	}

	.code-title {
		margin-left: auto;
		font-size: 0.75rem;
		color: #64748b;
		font-family: var(--font-mono);
	}

	.hero-code pre {
		margin: 0;
		padding: 1.25rem;
		background: var(--color-pre-bg);
		overflow-x: auto;
	}

	.hero-code code {
		font-size: 0.82rem;
		line-height: 1.7;
		color: var(--color-pre-text);
	}

	.code-prompt {
		color: var(--color-primary);
		user-select: none;
	}

	.code-comment {
		color: #64748b;
	}

	.code-success {
		color: var(--color-success);
	}

	/* ---- Sections ---- */
	.section {
		padding: 5rem 2rem;
	}

	.section-alt {
		background: var(--color-surface);
	}

	.container {
		max-width: 1100px;
		margin: 0 auto;
	}

	.section-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.section-header h2 {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-heading);
		letter-spacing: -0.02em;
		margin-bottom: 0.5rem;
	}

	.section-header p {
		font-size: 1.05rem;
		color: var(--color-text-muted);
		max-width: 520px;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* ---- Interfaces Grid ---- */
	.interfaces-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.interface-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 1.75rem;
		transition: all 0.2s ease;
	}

	.interface-card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 4px 16px rgba(139, 92, 246, 0.08);
		transform: translateY(-2px);
	}

	.interface-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: rgba(139, 92, 246, 0.08);
		color: var(--color-primary);
		border-radius: var(--radius-md);
		margin-bottom: 1rem;
	}

	.interface-card h3 {
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--color-heading);
		margin-bottom: 0.5rem;
	}

	.interface-card p {
		font-size: 0.9rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.interface-example {
		padding: 0.5rem 0.75rem;
		background: var(--color-code-bg);
		border-radius: var(--radius-sm);
		margin-bottom: 1rem;
	}

	.interface-example code {
		font-size: 0.8rem;
		color: var(--color-heading);
	}

	.interface-link {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-primary);
		transition: color 0.15s ease;
	}

	.interface-link:hover {
		color: var(--color-primary-hover);
	}

	/* ---- Features Grid ---- */
	.features-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.feature-card {
		padding: 1.5rem;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition: all 0.2s ease;
	}

	.feature-card:hover {
		border-color: rgba(139, 92, 246, 0.3);
		box-shadow: var(--shadow-sm);
	}

	.feature-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		color: var(--color-primary);
		margin-bottom: 0.75rem;
	}

	.feature-card h3 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-heading);
		margin-bottom: 0.4rem;
	}

	.feature-card p {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	/* ---- Architecture ---- */
	.architecture {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.arch-diagram {
		background: var(--color-pre-bg);
		color: var(--color-pre-text);
		padding: 2rem 2.5rem;
		border-radius: var(--radius-lg);
		overflow-x: auto;
		font-size: 0.82rem;
		line-height: 1.5;
		width: 100%;
		max-width: 620px;
		box-shadow: var(--shadow-md);
	}

	.arch-diagram code {
		color: inherit;
		background: none;
	}

	.arch-labels {
		display: flex;
		gap: 2.5rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.arch-label {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
	}

	.arch-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		margin-top: 5px;
		flex-shrink: 0;
	}

	.arch-dot-web {
		background: var(--color-primary);
	}

	.arch-dot-cli {
		background: var(--color-success);
	}

	.arch-dot-mcp {
		background: var(--color-warning);
	}

	.arch-label strong {
		display: block;
		font-size: 0.9rem;
		color: var(--color-heading);
	}

	.arch-label span {
		font-size: 0.8rem;
		color: var(--color-text-muted);
	}

	/* ---- Getting Started Steps ---- */
	.steps {
		max-width: 640px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	.step {
		display: flex;
		gap: 1.25rem;
		align-items: flex-start;
	}

	.step-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: var(--color-primary);
		color: #fff;
		border-radius: 50%;
		font-size: 0.9rem;
		font-weight: 700;
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.step-content {
		flex: 1;
		min-width: 0;
	}

	.step-content h3 {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--color-heading);
		margin-bottom: 0.75rem;
	}

	.step-content pre {
		background: var(--color-pre-bg);
		color: var(--color-pre-text);
		padding: 1rem 1.25rem;
		border-radius: var(--radius-md);
		overflow-x: auto;
		font-size: 0.82rem;
		line-height: 1.6;
	}

	.step-content pre code {
		color: inherit;
		background: none;
	}

	.step-connector {
		width: 2px;
		height: 2rem;
		background: var(--color-border);
		margin-left: 17px;
	}

	/* ---- CTA Section ---- */
	.section-cta {
		text-align: center;
		background:
			radial-gradient(ellipse 60% 80% at 50% 100%, rgba(139, 92, 246, 0.06) 0%, transparent 70%),
			var(--color-bg);
		padding: 4rem 2rem 5rem;
	}

	.section-cta h2 {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-heading);
		margin-bottom: 0.5rem;
	}

	.section-cta p {
		font-size: 1.05rem;
		color: var(--color-text-muted);
		margin-bottom: 2rem;
	}

	.cta-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}

	/* ---- Responsive ---- */
	@media (max-width: 900px) {
		.interfaces-grid {
			grid-template-columns: 1fr;
			max-width: 480px;
			margin: 0 auto;
		}

		.features-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.arch-labels {
			gap: 1.5rem;
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding: 3rem 1.25rem 2.5rem;
		}

		.hero h1 {
			font-size: 2.1rem;
		}

		.hero-subtitle {
			font-size: 1rem;
		}

		.hero-actions {
			flex-direction: column;
			align-items: center;
		}

		.hero-code {
			max-width: 100%;
		}

		.section {
			padding: 3rem 1.25rem;
		}

		.section-header h2 {
			font-size: 1.6rem;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.arch-diagram {
			font-size: 0.68rem;
			padding: 1.25rem;
		}

		.arch-labels {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		.step {
			gap: 1rem;
		}

		.cta-actions {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
