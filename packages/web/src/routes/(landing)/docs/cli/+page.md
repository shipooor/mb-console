---
layout: docs
title: CLI Reference
description: Complete command reference for the MagicBlock Console CLI.
section: reference
---

# CLI Reference

The MagicBlock Console CLI (`mb-console`) provides full control over Ephemeral Rollups from the terminal.

## Installation

```bash
npm install -g @magicblock-console/cli
```

## Authentication

The CLI authenticates via a Solana keypair file. Set the path through an environment variable:

```bash
export MB_KEYPAIR_PATH=~/.config/solana/id.json
```

If not set, the CLI looks for a keypair at `~/.config/solana/id.json` by default. If no keypair is found, the CLI runs in **simulated mode** — all operations return realistic mock data without touching the blockchain.

## Network

By default, the CLI connects to **devnet**. To change the network:

```bash
export MB_NETWORK=devnet   # or mainnet
```

## Projects

### `mb-console project create`

Create a new project.

```bash
mb-console project create <name> [options]
```

| Flag | Default | Description |
|------|---------|-------------|
| `--region <region>` | `us` | ER region: `us`, `eu`, `asia` |

### `mb-console project list`

List all projects.

```bash
mb-console project list
```

### `mb-console project configure`

Configure features for a project.

```bash
mb-console project configure <name> [options]
```

| Flag | Description |
|------|-------------|
| `--gasless` | Enable gasless transactions |
| `--privacy` | Enable privacy mode (TEE) |
| `--vrf` | Enable VRF randomness |
| `--cranks` | Enable scheduled execution |
| `--oracle` | Enable price feeds |
| `--no-gasless` | Disable gasless |
| `--no-privacy` | Disable privacy |
| `--no-vrf` | Disable VRF |
| `--no-cranks` | Disable cranks |
| `--no-oracle` | Disable oracle |

### `mb-console project get`

Display current project configuration.

```bash
mb-console project get <name>
```

### `mb-console project delete`

Delete a project and all its configuration.

```bash
mb-console project delete <name>
```

## ER Management

### `mb-console er delegate`

Delegate an account to an Ephemeral Rollup.

```bash
mb-console er delegate <address> --project <name>
```

| Flag | Description |
|------|-------------|
| `--project <name>` | Target project (required) |
| `--owner-program <pubkey>` | Owner program of the account (required for real blockchain operations) |

### `mb-console er status`

Check delegation status of an account.

```bash
mb-console er status <address>
```

### `mb-console er commit`

Commit ER state to the Solana base layer.

```bash
mb-console er commit <address> --project <name>
```

### `mb-console er undelegate`

Undelegate an account — final commit + return to Solana.

```bash
mb-console er undelegate <address> --project <name>
```

| Flag | Description |
|------|-------------|
| `--project <name>` | Target project (required) |
| `--owner-program <pubkey>` | Owner program of the account |

### `mb-console er diff`

Show state diff between ER and base layer.

```bash
mb-console er diff <address>
```

### `mb-console er list`

List all delegated accounts in a project.

```bash
mb-console er list --project <name>
```

## Features

### `mb-console vrf request`

Request verifiable randomness.

```bash
mb-console vrf request --project <name>
```

### `mb-console privacy deposit`

Deposit SPL tokens into a private vault.

```bash
mb-console privacy deposit \
  --token <mint_address> \
  --amount <number> \
  --project <name>
```

### `mb-console privacy transfer`

Transfer tokens privately within PER.

```bash
mb-console privacy transfer \
  --token <mint_address> \
  --amount <number> \
  --to <recipient_wallet> \
  --project <name>
```

### `mb-console privacy withdraw`

Withdraw tokens from private vault to Solana.

```bash
mb-console privacy withdraw \
  --token <mint_address> \
  --amount <number> \
  --project <name>
```

### `mb-console crank create`

Create a scheduled execution task.

```bash
mb-console crank create \
  --interval <ms> \
  --iterations <count> \
  --project <name>
```

### `mb-console crank list`

List all cranks in a project.

```bash
mb-console crank list --project <name>
```

### `mb-console crank stop`

Stop a running crank.

```bash
mb-console crank stop <crank_id>
```

### `mb-console oracle price`

Get current price from a feed.

```bash
mb-console oracle price --feed <pair> --project <name>
```

## Monitoring

### `mb-console monitor status`

Show project status overview.

```bash
mb-console monitor status --project <name>
```

### `mb-console monitor logs`

Show project log entries.

```bash
mb-console monitor logs --project <name> [--limit <n>]
```

### `mb-console monitor costs`

Display cost breakdown.

```bash
mb-console monitor costs --project <name> [--period <period>]
```

Default period is `30d`. Options: `7d`, `30d`, `90d`.

## Configuration

Session and project data are stored in `~/.mb-console/`:

```
~/.mb-console/
├── <key1>.json
├── <key2>.json
└── ...
```

## Global Options

| Flag | Description |
|------|-------------|
| `--version` | Show version |
| `--help` | Show help |
