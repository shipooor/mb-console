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

Price data is derived from Pyth Lazer on-chain accounts:

1. A Price Feed PDA is derived from 4 seeds: `"price_feed"`, `"pyth-lazer"`, feed ID, and the Oracle Program ID
2. The price is stored as a signed 64-bit integer at byte offset 73
3. The final price is calculated by multiplying by `10^exponent`

The Console handles all PDA derivation and byte parsing. You get a clean JSON response.

Oracle Program ID: `PriCems5tHihc6UDXDjzjeawomAwBduWMGAi8ZUjppd`

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
