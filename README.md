# MagicBlock Console

> **Solana Blitz 2026** hackathon submission (March 6–8, 2026)

First unified developer console for MagicBlock Ephemeral Rollups on Solana.

## What is MagicBlock Console?

MagicBlock Console is a complete developer interface for managing Ephemeral Rollups — high-speed execution layers on Solana with gasless transactions, privacy via TEE, verifiable randomness, automated execution cranks, and oracle price feeds. Three interfaces — Web Dashboard, CLI, and MCP Server — all powered by one core TypeScript SDK.

## Architecture

```
         ┌──────────────────┐
         │    Core SDK      │
         │  (TypeScript)    │
         └────────┬─────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
┌────▼────┐ ┌────▼────┐ ┌────▼────┐
│ Web UI  │ │   CLI   │ │   MCP   │
│(Svelte) │ │ (Node)  │ │ Server  │
└─────────┘ └─────────┘ └─────────┘
```

## Features

- **Project Management** — Create, configure, and monitor multiple Ephemeral Rollup projects
- **ER Lifecycle** — Delegate accounts, execute transactions, commit state, undelegate
- **Gasless Mode** — Zero transaction fees on the rollup
- **Privacy via TEE** — Private vaults and transactions through Trusted Execution Environment
- **VRF/Randomness** — Verifiable random number generation for games and applications
- **Cranks** — Automated periodic execution and task scheduling
- **Oracle Feeds** — Real-time price data from Pyth Lazer
- **Monitoring & Costs** — Real-time status, transaction tracking, and cost breakdown
- **Multi-Region** — Deploy to US, EU, or Asia endpoints

## Quick Start

### Prerequisites

- Node.js >= 20
- npm

### Install & Build

```bash
git clone https://github.com/shipooor/mb-console.git
cd mb-console
npm install
npm run build
```

### Web Dashboard

```bash
npm run dev -w packages/web
# Open http://localhost:5173
```

### CLI

```bash
npm run build -w packages/core && npm run build -w packages/cli
npx @magicblock-console/cli --help
```

### MCP Server

```json
{
  "mcpServers": {
    "magicblock-console": {
      "command": "node",
      "args": ["packages/mcp/dist/index.js"],
      "env": {
        "MB_NETWORK": "devnet",
        "MB_KEYPAIR_PATH": "~/.config/solana/id.json"
      }
    }
  }
}
```

## Project Structure

```
packages/
├── core/   # @magicblock-console/core — shared SDK
├── web/    # @magicblock-console/web — SvelteKit (landing + docs + dashboard)
├── cli/    # @magicblock-console/cli — terminal tool
└── mcp/    # @magicblock-console/mcp — MCP server for AI agents
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Core SDK** | TypeScript, @solana/web3.js, @magicblock-labs/ephemeral-rollups-sdk |
| **Web UI** | Svelte 5, SvelteKit 2, mdsvex, CSS Variables |
| **CLI** | Commander.js |
| **MCP Server** | @modelcontextprotocol/sdk |
| **Network** | Solana Devnet + MagicBlock ER endpoints (US/EU/Asia) |

## Documentation

Full documentation including getting started, API reference, CLI commands, and MCP tools:

- Landing: http://localhost:5173
- Docs: http://localhost:5173/docs

## Development Workflow

This project follows **documentation-driven development**: docs first, implement against the docs, then adjust docs if implementation differs.

Each module has a corresponding doc page in `packages/web/src/routes/(landing)/docs/`. Code must match what the docs describe.

## Commands

```bash
# Development
npm run dev           # Run all packages in dev mode
npm run build         # Build all packages
npm run lint          # Lint all packages

# Per-package
npm run dev -w packages/web
npm run dev -w packages/cli
npm run build -w packages/core
```

## Hackathon

**Event:** [Solana Blitz](https://www.colosseum.org/) by MagicBlock — March 6–8, 2026

**Track:** Ephemeral Rollups / Infrastructure tooling

**What this demonstrates:**

- Complete developer workflow for MagicBlock Ephemeral Rollups — from project creation to monitoring
- Three interfaces (Web, CLI, MCP) sharing a single core SDK
- Real Solana integration: delegation, commits, undelegation via `@magicblock-labs/ephemeral-rollups-sdk`
- Simulated mode for instant demo without a Solana keypair
- Full feature coverage: gasless transactions, privacy (TEE), VRF, cranks, oracle, multi-region

**Try it:**

```bash
git clone https://github.com/shipooor/mb-console.git
cd mb-console && npm install && npm run build
npm run dev -w packages/web
# Open http://localhost:5173 → landing page
# Open http://localhost:5173/dashboard → interactive dashboard
```

## License

MIT — see [LICENSE](./LICENSE)
