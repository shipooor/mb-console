---
layout: docs
title: API Reference
description: Core SDK TypeScript API reference for MagicBlock Console.
section: reference
---

# Core SDK API Reference

The Core SDK (`@magicblock-console/core`) is the shared TypeScript library used by all three interfaces. You can also use it directly in your own applications.

## Installation

```bash
npm install @magicblock-console/core
```

## Configuration

### `createClient`

Create a Console client instance.

```typescript
import { createClient, FileStorage, MemoryStorage, BrowserStorage } from '@magicblock-console/core';

// CLI / Node.js
const client = createClient({
  network: 'devnet',
  storage: new FileStorage(),
});

// Connect with a Solana keypair for real blockchain operations
await client.connectWithKeypair('~/.config/solana/id.json');

// Web (browser)
const webClient = createClient({
  network: 'devnet',
  storage: new BrowserStorage(),
});
```

**Options:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `network` | `'devnet' \| 'mainnet'` | No | Network. Default: `devnet` |
| `storage` | `Storage` | Yes | Storage backend (`FileStorage`, `MemoryStorage`, or `BrowserStorage`) |

Call `client.connectWithKeypair(path)` to enable real blockchain operations. Without it, the SDK runs in simulated mode.

## Projects

### `client.projects.create`

```typescript
const project = await client.projects.create({
  name: 'my-game',
  region: 'us',
  features: {
    gasless: true,
    privacy: false,
    vrf: true,
    cranks: false,
    oracle: false,
  },
});
```

**Returns:** `Project`

### `client.projects.list`

```typescript
const projects = await client.projects.list();
```

**Returns:** `Project[]`

### `client.projects.get`

```typescript
const project = await client.projects.get('my-game');
```

**Returns:** `Project | null`

### `client.projects.configure`

```typescript
await client.projects.configure('my-game', {
  features: { vrf: true, cranks: true },
});
```

### `client.projects.delete`

```typescript
await client.projects.delete('my-game');
```

## ER Lifecycle

### `client.er.delegate`

Delegate an account to an Ephemeral Rollup.

```typescript
const result = await client.er.delegate({
  account: 'AccountPublicKey...',
  project: 'my-game',
});
```

**Returns:** `DelegationResult`

```typescript
interface DelegationResult {
  signature: string;
  validator: string;
  delegatedAt: Date;
  simulated: boolean;
  slot?: number;
}
```

### `client.er.status`

Check delegation status.

```typescript
const status = await client.er.status('AccountPublicKey...');
```

**Returns:** `DelegationStatus`

```typescript
interface DelegationStatus {
  isDelegated: boolean;
  validator?: string;
  validatorPubkey?: string;
  delegatedAt?: Date;
}
```

### `client.er.commit`

Commit ER state to base layer.

```typescript
const result = await client.er.commit({
  account: 'AccountPublicKey...',
  project: 'my-game',
});
```

**Returns:** `CommitResult`

### `client.er.undelegate`

Undelegate — final commit and return.

```typescript
const result = await client.er.undelegate({
  account: 'AccountPublicKey...',
  project: 'my-game',
});
```

### `client.er.accounts`

List delegated accounts in a project.

```typescript
const accounts = await client.er.accounts('my-game');
```

**Returns:** `DelegatedAccount[]`

### `client.er.diff`

Get state diff between ER and base layer.

```typescript
const diff = await client.er.diff('AccountPublicKey...');
```

**Returns:** `StateDiff`

## VRF

### `client.vrf.request`

Request verifiable randomness.

```typescript
const result = await client.vrf.request({ project: 'my-game' });
```

**Returns:** `VrfResult`

```typescript
interface VrfResult {
  requestId: string;
  randomness: Uint8Array;
  proof: string;
  latencyMs: number;
}
```

### VRF Utilities

Static utility functions for working with random bytes.

```typescript
import { vrf } from '@magicblock-console/core';

// Random integer in range [min, max] inclusive
vrf.randomInRange(randomBytes: Uint8Array, min: number, max: number): number

// Pick random element from array
vrf.randomPick<T>(randomBytes: Uint8Array, items: T[]): T

// Split randomness into N independent values
vrf.split(randomBytes: Uint8Array, count: number): Uint8Array[]
```

## Privacy

### `client.privacy.deposit`

```typescript
const result = await client.privacy.deposit({
  project: 'my-game',
  token: 'TokenMintAddress...',
  amount: 100,
});
```

### `client.privacy.transfer`

```typescript
const result = await client.privacy.transfer({
  project: 'my-game',
  token: 'TokenMintAddress...',
  amount: 50,
  to: 'RecipientWallet...',
});
```

### `client.privacy.withdraw`

```typescript
const result = await client.privacy.withdraw({
  project: 'my-game',
  token: 'TokenMintAddress...',
  amount: 25,
});
```

## Cranks

### `client.cranks.create`

```typescript
const crank = await client.cranks.create({
  project: 'my-game',
  intervalMs: 5000,
  iterations: 100,
});
```

**Returns:** `Crank`

```typescript
interface Crank {
  id: string;
  intervalMs: number;
  iterations: number;
  executed: number;
  status: 'running' | 'completed' | 'stopped';
}
```

### `client.cranks.list`

```typescript
const cranks = await client.cranks.list('my-game');
```

### `client.cranks.stop`

```typescript
await client.cranks.stop('crank_id');
```

## Oracle

### `client.oracle.getPrice`

```typescript
const price = await client.oracle.getPrice({
  project: 'my-game',
  feed: 'SOL/USD',
});
```

**Returns:** `PriceFeed`

```typescript
interface PriceFeed {
  feed: string;
  price: number;
  confidence: number;
  timestamp: Date;
  slot: number;
}
```

## Monitoring

### `client.monitor.status`

```typescript
const status = await client.monitor.status('my-game');
```

**Returns:** `ProjectStatus`

```typescript
interface ProjectStatus {
  project: string;
  region: string;
  features: FeatureFlags;
  accounts: DelegatedAccount[];
  uptime: number;
  transactionCount: number;
}
```

### `client.monitor.costs`

```typescript
const costs = await client.monitor.costs('my-game');
```

**Returns:** `CostBreakdown`

```typescript
interface CostBreakdown {
  transactions: { count: number; cost: number };
  commits: { count: number; cost: number };
  sessions: { count: number; cost: number };
  total: number;
  period: string;
}
```

### `client.monitor.logs`

```typescript
const logs = await client.monitor.logs('my-game', 50);
```

**Returns:** `LogEntry[]`

## Types

### `Project`

```typescript
interface Project {
  name: string;
  region: Region;
  features: FeatureFlags;
  createdAt: Date;
}
```

### `FeatureFlags`

```typescript
interface FeatureFlags {
  gasless: boolean;
  privacy: boolean;
  vrf: boolean;
  cranks: boolean;
  oracle: boolean;
}
```

### `Region`

```typescript
type Region = 'us' | 'eu' | 'asia';
```
