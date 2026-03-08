---
layout: docs
title: Oracle
description: Access real-time Pyth Lazer price feeds on Ephemeral Rollups.
section: features
---

# Oracle — Price Feeds

MagicBlock integrates Pyth Lazer for real-time price data on Ephemeral Rollups. Access price feeds for major assets with low latency.

## Enable Oracle

**CLI**:

```bash
mb-console project configure my-game --oracle
```

**Web**: Project Settings → Features → toggle "Oracle" on.

## Get a Price

### CLI

```bash
mb-console oracle price --feed SOL/USD --project my-game
```

Output:

```json
{
  "feed": "SOL/USD",
  "price": 142.85,
  "confidence": 0.12,
  "timestamp": "2026-03-06T12:00:00Z",
  "slot": 281947253
}
```

### Web

Project → Oracle → select feed from dropdown → live price display.

### MCP

Use the `get_price_feed` tool:

> "What is the current SOL/USD price in my-game?"

## Available Feeds

Common price feeds available through Pyth Lazer:

| Feed | Pair |
|------|------|
| SOL/USD | Solana / US Dollar |
| BTC/USD | Bitcoin / US Dollar |
| ETH/USD | Ethereum / US Dollar |
| USDC/USD | USDC / US Dollar |

## How It Works

Price data is read from Pyth Solana Receiver on-chain accounts:

1. `PriceUpdateV2` accounts are found via `getProgramAccounts` with a `memcmp` filter matching the 32-byte feed ID at byte offset 41
2. The price is stored as a signed 64-bit integer at byte offset 73, with a confidence interval (u64) at offset 81 and exponent (i32) at offset 89
3. The final price is calculated as `rawPrice * 10^exponent`; stale data (>120s) is rejected automatically

The Console handles all account discovery and byte parsing. You get a clean JSON response.

Pyth Solana Receiver Program: `rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ`

## Monitoring

Price feed requests are tracked in project monitoring:

```bash
mb-console monitor status --project my-game
```

The Oracle tab shows:
- Feed subscription status
- Latest prices
- Request history

## Next Steps

- [VRF](/docs/features/vrf) — verifiable randomness
- [Cranks](/docs/features/cranks) — combine with oracle for periodic price updates
