---
layout: docs
title: VRF (Randomness)
description: Generate verifiable random numbers on Ephemeral Rollups.
section: features
---

# VRF — Verifiable Random Function

MagicBlock provides on-chain verifiable randomness through VRF oracles. When used on an Ephemeral Rollup, VRF requests are free and resolve in approximately 100 milliseconds.

## Pricing

| Environment | Cost | Latency |
|-------------|------|---------|
| Solana (standard) | 0.0005 SOL | ~1 second |
| Ephemeral Rollup | **Free** | ~100ms |

## Enable VRF

**CLI**:

```bash
mb-console project configure my-game --vrf
```

**Web**: Project Settings → Features → toggle "VRF" on.

## Request Randomness

### CLI

```bash
mb-console vrf request --project my-game
```

Output:

```json
{
  "requestId": "7kP2...",
  "randomness": "a3f8c2e1...",
  "slot": 281947253,
  "latencyMs": 94
}
```

### Web

Project → VRF → "Request Randomness" button. The result displays immediately with the random value and verification proof.

### MCP

Use the `request_vrf` tool:

> "Generate a random number for my-game"

## How It Works

1. Your program (or the Console) submits a VRF request to the oracle queue
2. The VRF oracle generates a cryptographic random value
3. A callback delivers `[u8; 32]` — 32 bytes of randomness
4. The randomness is verifiable: anyone can check the proof against the oracle's public key

## Use Cases

- **Gaming**: dice rolls, card shuffles, loot drops
- **NFTs**: random trait generation
- **DeFi**: fair lottery selection
- **Governance**: random committee selection

## Randomness Utilities

The Core SDK provides helpers to convert raw VRF output:

```typescript
import { vrf } from '@magicblock-console/core';

// Random integer in range [min, max]
const roll = vrf.randomInRange(randomBytes, 1, 6);

// Random selection from array
const winner = vrf.randomPick(randomBytes, participants);

// Multiple random values from single seed
const [r1, r2, r3] = vrf.split(randomBytes, 3);
```

## Monitoring

VRF requests are tracked in the project monitoring:

```bash
mb-console monitor --project my-game
```

The VRF tab shows:
- Total requests
- Average latency
- Request history with random values

## Next Steps

- [Cranks](/docs/features/cranks) — scheduled automatic execution
- [Oracle](/docs/features/oracle) — price feed integration
