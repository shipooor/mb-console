# MagicBlock Console

## Vision

First unified developer interface for managing MagicBlock Ephemeral Rollups on Solana.
Three access points — one core: **Web Dashboard**, **CLI**, **MCP Server**.

Developer picks their workflow:
- **Web** — visual project management, monitoring, one-click configuration
- **CLI** — scripting, CI/CD integration, power-user workflows
- **MCP** — AI-agent driven infrastructure management from any MCP-compatible client

```
                         ┌──────────────────┐
                         │    Core SDK      │
                         │  (TypeScript)    │
                         │                  │
                         │  - ER lifecycle  │
                         │  - Config mgmt  │
                         │  - Monitoring    │
                         │  - Wallet auth   │
                         └────────┬─────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
           ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
           │  Web UI   │   │    CLI    │   │    MCP    │
           │ (Svelte)  │   │  (Node)  │   │  Server   │
           └───────────┘   └───────────┘   └───────────┘
```

## Problem

Today, to use Ephemeral Rollups a developer must:
1. Read fragmented documentation
2. Write boilerplate SDK code for every feature
3. Manually manage delegation, commits, undelegation
4. Monitor state through generic Solana Explorer
5. Configure VRF, privacy, gasless separately with no unified interface
6. No visibility into ER health, costs, or performance

No console. No CLI for ER management. No AI integration. Everything is manual.

## Solution

### Landing Page (`/`)

SSR + prerendered. SEO-optimized entry point.

- Hero section: "One console for all MagicBlock features"
- Feature highlights (gasless, privacy, VRF, cranks, oracle)
- Three interfaces: Web + CLI + MCP
- Code snippets / terminal previews
- CTA → Connect Wallet → Dashboard
- CTA → Read the Docs

### Documentation (`/docs`)

SSR + prerendered. Markdown content via mdsvex. Primary SEO driver.

**Layout**
- Sidebar with hierarchical navigation (auto-generated from file structure)
- Table of contents from headings (right side)
- Search across all docs (client-side, by headings + content)
- Prev / Next navigation
- Code blocks with syntax highlighting + copy button
- Dark mode support

**Sections**
- Getting Started — quickstart for all three interfaces
- ER Lifecycle — delegation, execution, commit, undelegation
- Features — gasless, privacy, VRF, cranks, oracle (each own page)
- CLI Reference — all commands with examples
- MCP Reference — all tools with parameters
- API Reference — core SDK methods

### Web Dashboard

Wallet-connected web app for visual ER management.

**Project Management**
- Create / list / archive projects
- Each project = isolated ER configuration
- Project-level settings (region, features, keys)

**ER Lifecycle**
- One-click create Ephemeral Rollup
- Select region (US / EU / Asia)
- Configure features per project:
  - Gasless mode (on/off)
  - Privacy mode via TEE (on/off)
  - VRF / Randomness (on/off)
  - Cranks / Auto-execution (schedules)
  - Oracle price feeds (feed selection)
  - Session Keys (expiry, scope)
- Visual delegation status (delegated / executing / committed / undelegated)
- Manual commit / undelegate controls

**Monitoring**
- Real-time ER status per project
- Transaction count / throughput
- Delegation status of accounts
- Cost tracking (session fees, commit fees)
- Console logs / event stream

**Account Explorer**
- View delegated accounts
- Account state diff (ER vs base layer)
- Delegation history

### CLI

Terminal tool for scripting and CI/CD.

```bash
# Auth
mb-console login                    # Wallet connect via browser callback
mb-console whoami                   # Show connected wallet

# Projects
mb-console project create <name>    # Create project
mb-console project list             # List projects
mb-console project use <name>       # Set active project
mb-console project config           # Show project config

# ER Management
mb-console er create \
  --region us \
  --gasless \
  --vrf \
  --privacy                         # Create ER with features

mb-console er status                # ER status
mb-console er list                  # List active ERs
mb-console er commit <account>      # Commit account state
mb-console er undelegate <account>  # Undelegate account
mb-console er destroy               # Shutdown ER

# Features
mb-console vrf request              # Request randomness
mb-console crank create \
  --interval 5000 \
  --iterations 100                  # Schedule crank

mb-console privacy deposit \
  --token <mint> \
  --amount 100                      # Deposit to PER vault

mb-console oracle price \
  --feed SOL/USD                    # Get price feed

# Monitoring
mb-console monitor                  # Live dashboard (TUI)
mb-console logs                     # Stream ER events
mb-console costs                    # Cost breakdown
```

### MCP Server

AI-agent interface for managing ERs from any MCP-compatible client.

**Tools exposed:**

| Tool | Description |
|------|-------------|
| `create_project` | Create a new project with ER configuration |
| `list_projects` | List all projects and their status |
| `configure_er` | Configure Ephemeral Rollup features |
| `get_er_status` | Get current ER status and health |
| `delegate_account` | Delegate account to ER |
| `commit_state` | Commit ER state to base layer |
| `undelegate_account` | Undelegate and return to Solana |
| `request_vrf` | Request verifiable randomness |
| `create_crank` | Schedule automatic execution |
| `deposit_private` | Deposit tokens to private vault |
| `transfer_private` | Private token transfer |
| `withdraw_private` | Withdraw from private vault |
| `get_price_feed` | Get oracle price data |
| `get_costs` | Get cost breakdown |
| `get_logs` | Get recent ER events |
| `get_delegation_status` | Check account delegation status |

**Example AI interaction:**

```
User: "Set up a new project for my game with gasless
       transactions and VRF in the EU region"

Agent: [calls create_project]
       [calls configure_er with gasless + vrf + region:eu]

       "Done. Project 'my-game' created with:
        - Region: EU (devnet-eu.magicblock.app)
        - Gasless: enabled (0 tx fees on ER)
        - VRF: enabled (~100ms, free on ER)
        - Endpoint: https://devnet-eu.magicblock.app"
```

## Core SDK

Shared TypeScript library used by all three interfaces.

```
@magicblock-console/core
├── auth/           # Wallet connection + signing
├── projects/       # Project CRUD + config storage
├── er/             # ER lifecycle (delegate, commit, undelegate)
├── features/
│   ├── gasless/    # Gasless tx configuration
│   ├── privacy/    # PER API integration
│   ├── vrf/        # VRF request/callback
│   ├── cranks/     # Task scheduling
│   ├── oracle/     # Pyth Lazer feeds
│   └── sessions/   # Session key management
├── monitor/        # Status polling, event streams
└── config/         # Region selection, endpoints, program IDs
```

### Key Integrations

| Integration | How |
|-------------|-----|
| Magic Router | JSON-RPC 2.0 via `https://devnet-router.magicblock.app` |
| Delegation Program | `DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh` |
| PER API | REST via `https://tee.magicblock.app` |
| VRF | On-chain via `ephemeral_vrf_sdk` |
| Oracle | PDA derivation from Pyth Lazer |
| Session Keys | `@magicblock-labs/gum-react-sdk` (adapter for Svelte) |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Core SDK | TypeScript, `@magicblock-labs/ephemeral-rollups-sdk`, `@solana/web3.js` |
| Web UI | Svelte 5, SvelteKit 2, Vite, `@solana/web3.js`, CSS Variables |
| CLI | Node.js, Commander.js, Ink (React for TUI) |
| MCP Server | TypeScript, `@modelcontextprotocol/sdk` |
| Storage | LocalStorage (web), `~/.mb-console/` (CLI), in-memory (MCP) |
| Network | Solana Devnet + MagicBlock ER endpoints |

## Project Structure

```
magicBlockConsole/
├── packages/
│   ├── core/               # @magicblock-console/core
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── er/
│   │   │   ├── features/
│   │   │   ├── monitor/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── web/                # @magicblock-console/web (SvelteKit)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── components/
│   │   │   │   │   ├── landing/    # Landing page components
│   │   │   │   │   ├── dashboard/  # Dashboard components
│   │   │   │   │   └── shared/     # Shared UI (buttons, modals)
│   │   │   │   ├── stores/
│   │   │   │   └── utils/
│   │   │   ├── routes/
│   │   │   │   ├── (landing)/      # SSR + prerender (SEO)
│   │   │   │   │   ├── +layout.ts  # prerender = true
│   │   │   │   │   ├── +page.svelte        # "/" landing
│   │   │   │   │   └── docs/
│   │   │   │   │       ├── +layout.svelte  # DocsLayout (sidebar + TOC)
│   │   │   │   │       ├── +page.svelte    # "/docs" overview
│   │   │   │   │       ├── getting-started/
│   │   │   │   │       │   └── +page.md
│   │   │   │   │       ├── er-lifecycle/
│   │   │   │   │       │   └── +page.md
│   │   │   │   │       ├── features/
│   │   │   │   │       │   ├── gasless/+page.md
│   │   │   │   │       │   ├── privacy/+page.md
│   │   │   │   │       │   ├── vrf/+page.md
│   │   │   │   │       │   ├── cranks/+page.md
│   │   │   │   │       │   └── oracle/+page.md
│   │   │   │   │       ├── cli/
│   │   │   │   │       │   └── +page.md
│   │   │   │   │       ├── mcp/
│   │   │   │   │       │   └── +page.md
│   │   │   │   │       └── api-reference/
│   │   │   │   │           └── +page.md
│   │   │   │   ├── (app)/          # SPA, client-only
│   │   │   │   │   ├── +layout.ts  # ssr = false
│   │   │   │   │   ├── +layout.svelte      # AuthGate + app shell
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   └── +page.svelte    # "/dashboard"
│   │   │   │   │   ├── project/
│   │   │   │   │   │   ├── +page.svelte    # "/project" (list)
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── +page.svelte # "/project/:id"
│   │   │   │   │   └── monitor/
│   │   │   │   │       └── +page.svelte    # "/monitor"
│   │   │   │   └── +layout.svelte  # Root layout
│   │   │   └── app.html
│   │   └── package.json
│   │
│   ├── cli/                # @magicblock-console/cli
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── mcp/                # @magicblock-console/mcp
│       ├── src/
│       │   ├── tools/
│       │   ├── server.ts
│       │   └── index.ts
│       └── package.json
│
├── package.json            # Workspace root
├── tsconfig.json
├── CONCEPT.md
└── README.md
```

## ER Lifecycle in Console

```
┌─────────────────────────────────────────────────────────┐
│                    Console User Flow                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Connect Wallet (Phantom / Solflare / CLI keypair)   │
│                         │                               │
│  2. Create Project      │                               │
│     - Name              │                               │
│     - Region (US/EU/AS) │                               │
│     - Features toggle   │                               │
│                         │                               │
│  3. Deploy ER           │                               │
│     - Auto-delegate     │     ┌──────────────────┐      │
│       accounts ─────────┼────>│  Ephemeral       │      │
│                         │     │  Rollup          │      │
│  4. Operate             │     │                  │      │
│     - Send transactions │     │  - Gasless       │      │
│     - Request VRF       │     │  - Privacy (TEE) │      │
│     - Schedule cranks   │     │  - VRF           │      │
│     - Private transfers │     │  - Cranks        │      │
│                         │     │  - Oracle        │      │
│  5. Monitor             │     │                  │      │
│     - Live status       │     └──────┬───────────┘      │
│     - Transaction feed  │            │                  │
│     - Cost tracking     │            │ commit           │
│                         │            ▼                  │
│  6. Commit / Undelegate │     ┌──────────────────┐      │
│     - Manual or auto    │     │  Solana Base     │      │
│     - State finalized   │     │  Layer           │      │
│       on Solana ────────┼────>│                  │      │
│                         │     └──────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Feature Matrix

| Feature | Web | CLI | MCP |
|---------|-----|-----|-----|
| Wallet connect | Browser adapter | Keypair file / browser callback | Keypair config |
| Create project | Form UI | `project create` | `create_project` tool |
| Configure ER | Toggle switches | Flags (`--gasless --vrf`) | Tool parameters |
| Deploy ER | One-click button | `er create` | `configure_er` tool |
| Delegate account | UI action | `er delegate` | `delegate_account` tool |
| Commit state | Button | `er commit` | `commit_state` tool |
| Undelegate | Button | `er undelegate` | `undelegate_account` tool |
| VRF request | UI panel | `vrf request` | `request_vrf` tool |
| Privacy deposit | Form | `privacy deposit` | `deposit_private` tool |
| Privacy transfer | Form | `privacy transfer` | `transfer_private` tool |
| Crank schedule | Config panel | `crank create` | `create_crank` tool |
| Oracle feed | Live display | `oracle price` | `get_price_feed` tool |
| Monitor | Real-time dashboard | TUI (`monitor`) | `get_er_status` tool |
| Cost tracking | Charts | `costs` | `get_costs` tool |
| Logs | Event stream | `logs` | `get_logs` tool |

## Differentiators

1. **First unified console for MagicBlock** — nothing like this exists
2. **Three interfaces, one core** — web + CLI + MCP covers every developer workflow
3. **MCP Server** — first AI-agent integration for Solana infrastructure management
4. **Full feature coverage** — gasless, privacy, VRF, cranks, oracle, session keys
5. **Zero backend** — core SDK talks directly to MagicBlock APIs and Solana RPC

## Hackathon Scope

All features implemented across all three interfaces:

- [x] Wallet authentication
- [x] Project management (create, list, configure)
- [x] ER lifecycle (create, delegate, commit, undelegate)
- [x] Gasless configuration
- [x] Privacy mode (PER deposit, transfer, withdraw)
- [x] VRF / Randomness requests
- [x] Crank scheduling
- [x] Oracle price feeds
- [x] Monitoring and status
- [x] Cost tracking
- [x] MCP Server with all tools
- [x] CLI with all commands
- [x] Web dashboard with full UI
