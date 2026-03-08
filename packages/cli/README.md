# @magicblock-console/cli

CLI for managing [MagicBlock Ephemeral Rollups](https://www.magicblock.gg/) on Solana. Full control over ER lifecycle, features, and monitoring from the terminal.

## Installation

```bash
npm install -g @magicblock-console/cli
```

## Authentication

Set your Solana keypair path:

```bash
export MB_KEYPAIR_PATH=~/.config/solana/id.json
```

Without a keypair, the CLI runs in **simulated mode** with realistic mock data.

## Usage

### Projects

```bash
mb-console project create my-game --region us
mb-console project list
mb-console project configure my-game --gasless --vrf --privacy
mb-console project get my-game
```

### ER Lifecycle

```bash
mb-console er delegate <address> --project my-game
mb-console er status <address>
mb-console er commit <address> --project my-game
mb-console er undelegate <address> --project my-game
mb-console er list --project my-game
```

### Features

```bash
# VRF — verifiable randomness
mb-console vrf request --project my-game

# Privacy — confidential transfers via TEE
mb-console privacy deposit --token SOL --amount 1.0 --project my-game
mb-console privacy transfer --token SOL --amount 0.5 --to <wallet> --project my-game
mb-console privacy withdraw --token SOL --amount 0.5 --project my-game

# Cranks — scheduled execution
mb-console crank create --interval 5000 --iterations 100 --project my-game
mb-console crank list --project my-game
mb-console crank stop <crank_id>

# Oracle — price feeds
mb-console oracle price --feed SOL/USD --project my-game
```

### Monitoring

```bash
mb-console monitor status --project my-game
mb-console monitor logs --project my-game --limit 20
mb-console monitor costs --project my-game --period 30d
```

## Related Packages

- [`@magicblock-console/core`](https://www.npmjs.com/package/@magicblock-console/core) — Core SDK
- [`@magicblock-console/mcp`](https://www.npmjs.com/package/@magicblock-console/mcp) — AI agent interface (MCP Server)

## License

MIT
