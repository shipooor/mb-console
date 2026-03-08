---
layout: docs
title: Getting Started
description: Set up MagicBlock Console and create your first Ephemeral Rollup in under 5 minutes.
section: guides
---

# Getting Started

MagicBlock Console provides three ways to manage Ephemeral Rollups on Solana: a **Web Dashboard**, a **CLI**, and an **MCP Server** for AI-agent workflows. All three share the same Core SDK underneath.

## Installation

### Web Dashboard

No installation needed. Run `npm run dev -w packages/web` and open the dashboard to start managing your ERs.

### CLI

```bash
git clone https://github.com/shipooor/magicBlockConsole.git
cd magicBlockConsole
npm install && npm run build
```

Run any command via the workspace:

```bash
npx mb-console --version
```

### MCP Server

Add MagicBlock Console to your MCP client configuration:

```json
{
  "mcpServers": {
    "magicblock-console": {
      "command": "node",
      "args": ["<path-to-repo>/packages/mcp/dist/index.js"]
    }
  }
}
```

## Quick Start

### 1. Authentication

**Web**: Open the dashboard — the web interface runs in simulated mode by default. Wallet adapter integration is planned for production.

**CLI**: Set your Solana keypair path:

```bash
export MB_KEYPAIR_PATH=~/.config/solana/id.json
```

If no keypair is found, the CLI runs in simulated mode with realistic mock data.

**MCP**: Configure your keypair path in the MCP server settings:

```json
{
  "mcpServers": {
    "magicblock-console": {
      "command": "node",
      "args": ["<path-to-repo>/packages/mcp/dist/index.js"],
      "env": {
        "MB_KEYPAIR_PATH": "~/.config/solana/id.json"
      }
    }
  }
}
```

### 2. Create a Project

A project is a logical group that holds your ER configuration, delegated accounts, and monitoring data.

**Web**: Dashboard → "New Project" → enter name and select region.

**CLI**:

```bash
mb-console project create my-game --region us
```

**MCP**:

> "Create a new project called my-game in the US region"

### 3. Configure Features

Enable the features your application needs:

```bash
mb-console project configure my-game \
  --gasless \
  --vrf
```

Available features:

| Feature | Flag | Description |
|---------|------|-------------|
| Gasless | `--gasless` | Zero transaction fees on ER |
| Privacy | `--privacy` | Private state via TEE |
| VRF | `--vrf` | Verifiable randomness |
| Cranks | `--cranks` | Scheduled auto-execution |
| Oracle | `--oracle` | Pyth Lazer price feeds |

### 4. Delegate an Account

Delegating an account moves it from Solana to your Ephemeral Rollup for high-speed execution:

```bash
mb-console er delegate <ACCOUNT_ADDRESS> --project my-game
```

The account is now running on the ER. Transactions execute with near-instant finality and zero fees (if gasless is enabled).

### 5. Monitor

```bash
mb-console monitor status --project my-game
```

This shows a project status overview including:
- ER status and uptime
- Delegated accounts
- Transaction throughput
- Cost accumulation

## Regions

MagicBlock operates ER validators in three regions:

| Region | Endpoint | Latency Target |
|--------|----------|----------------|
| US | `devnet-us.magicblock.app` | Americas |
| EU | `devnet-eu.magicblock.app` | Europe, Africa |
| Asia | `devnet-as.magicblock.app` | Asia-Pacific |

Choose the region closest to your users for optimal performance.

## Network

MagicBlock Console operates on **Solana Devnet** by default. All transactions, delegations, and ER operations use devnet SOL.

## Next Steps

- [ER Lifecycle](/docs/er-lifecycle) — understand delegation, execution, and commits
- [Gasless Transactions](/docs/features/gasless) — zero-fee execution
- [Privacy Mode](/docs/features/privacy) — confidential state with TEE
- [CLI Reference](/docs/cli) — full command reference
- [MCP Reference](/docs/mcp) — AI-agent tool reference
