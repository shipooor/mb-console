# @magicblock-console/core

Core SDK for managing [MagicBlock Ephemeral Rollups](https://www.magicblock.gg/) on Solana. Shared logic used by the CLI, MCP Server, and Web Dashboard.

## Features

- **Project Management** — create, configure, and manage ER projects
- **ER Lifecycle** — delegate, commit, undelegate accounts on Ephemeral Rollups
- **Gasless Transactions** — zero-fee execution on ER
- **Privacy Mode** — confidential state via TEE (Private Ephemeral Rollups)
- **VRF** — verifiable randomness requests
- **Cranks** — scheduled automatic execution
- **Oracle** — Pyth price feeds on ER
- **Monitoring** — status, costs, and logs

## Installation

```bash
npm install @magicblock-console/core
```

## Quick Start

```typescript
import { createClient, MemoryStorage } from '@magicblock-console/core';

const client = createClient({
  network: 'devnet',
  storage: new MemoryStorage(),
});

// Create a project
await client.projects.create({ name: 'my-game', region: 'us' });

// Enable features
await client.projects.configure('my-game', {
  features: { gasless: true, vrf: true },
});

// Delegate an account to ER
await client.er.delegate({
  account: 'YourAccountPubkey...',
  project: 'my-game',
});

// Request VRF randomness
const result = await client.vrf.request({ project: 'my-game' });
console.log(result.randomness); // 32 bytes of randomness
```

## Wallet Connection

Connect a Solana wallet for real blockchain operations:

```typescript
// From keypair file (CLI/server)
await client.connectWithKeypair('~/.config/solana/id.json');

// From browser wallet (web)
await client.connectWithSigner({
  publicKey: wallet.publicKey,
  signTransaction: (tx) => wallet.signTransaction(tx),
});
```

Without a wallet connection, all operations run in **simulated mode** with realistic mock data.

## Network

Operates on Solana Devnet by default. ER validators available in US, EU, and Asia regions.

## Related Packages

- [`@magicblock-console/cli`](https://www.npmjs.com/package/@magicblock-console/cli) — Terminal interface
- [`@magicblock-console/mcp`](https://www.npmjs.com/package/@magicblock-console/mcp) — AI agent interface (MCP Server)

## License

MIT
