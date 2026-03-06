<svelte:head>
  <title>Documentation — MagicBlock Console</title>
  <meta name="description" content="MagicBlock Console documentation. Learn how to manage Ephemeral Rollups via Web, CLI, or MCP." />
</svelte:head>

<div class="docs-index">
  <h1>Documentation</h1>
  <p class="lead">Everything you need to manage Ephemeral Rollups on Solana.</p>

  <section class="doc-group">
    <h2>Get Started</h2>
    <div class="doc-cards">
      <a href="/docs/getting-started" class="doc-card">
        <h3>Getting Started</h3>
        <p>Install the Console and create your first Ephemeral Rollup.</p>
      </a>
      <a href="/docs/er-lifecycle" class="doc-card">
        <h3>ER Lifecycle</h3>
        <p>Delegation, execution, commits, and undelegation explained.</p>
      </a>
    </div>
  </section>

  <section class="doc-group">
    <h2>Features</h2>
    <div class="doc-cards">
      <a href="/docs/features/gasless" class="doc-card">
        <h3>Gasless Transactions</h3>
        <p>Zero-fee execution on Ephemeral Rollups.</p>
      </a>
      <a href="/docs/features/privacy" class="doc-card">
        <h3>Privacy Mode</h3>
        <p>Confidential state with Trusted Execution Environments.</p>
      </a>
      <a href="/docs/features/vrf" class="doc-card">
        <h3>VRF (Randomness)</h3>
        <p>Verifiable random numbers, free on ER.</p>
      </a>
      <a href="/docs/features/cranks" class="doc-card">
        <h3>Cranks</h3>
        <p>Scheduled automatic transaction execution.</p>
      </a>
      <a href="/docs/features/oracle" class="doc-card">
        <h3>Oracle</h3>
        <p>Real-time Pyth Lazer price feeds.</p>
      </a>
    </div>
  </section>

  <section class="doc-group">
    <h2>Reference</h2>
    <div class="doc-cards">
      <a href="/docs/cli" class="doc-card">
        <h3>CLI Reference</h3>
        <p>Complete command reference for mb-console.</p>
      </a>
      <a href="/docs/mcp" class="doc-card">
        <h3>MCP Reference</h3>
        <p>AI-agent tool reference for the MCP server.</p>
      </a>
      <a href="/docs/api-reference" class="doc-card">
        <h3>API Reference</h3>
        <p>Core SDK TypeScript API documentation.</p>
      </a>
    </div>
  </section>
</div>

<style>
  .docs-index {
    max-width: 800px;
    padding: 2rem 0;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-heading, #0f0f23);
  }

  .lead {
    font-size: 1.15rem;
    color: var(--color-text-muted, #64748b);
    margin-bottom: 2.5rem;
  }

  .doc-group {
    margin-bottom: 2.5rem;
  }

  .doc-group h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border, #e2e8f0);
  }

  .doc-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }

  .doc-card {
    display: block;
    padding: 1.25rem;
    background: var(--color-surface, #ffffff);
    border: 1px solid var(--color-border, #e2e8f0);
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .doc-card:hover {
    border-color: var(--color-primary, #8b5cf6);
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
  }

  .doc-card h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.375rem;
    color: var(--color-heading, #0f0f23);
  }

  .doc-card p {
    font-size: 0.875rem;
    color: var(--color-text-muted, #64748b);
    margin: 0;
    line-height: 1.5;
  }
</style>
