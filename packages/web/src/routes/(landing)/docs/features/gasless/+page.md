---
layout: docs
title: Gasless Transactions
description: Execute transactions on Ephemeral Rollups with zero fees.
section: features
---

# Gasless Transactions

Ephemeral Rollups on MagicBlock public nodes have a base transaction fee of **zero**. Your users can interact with your application without holding SOL for gas.

## How It Works

On Solana, every transaction requires a fee (typically 0.000005 SOL). On an Ephemeral Rollup, the ER validator absorbs transaction costs. The only fees are:

| Fee Type | Amount | When |
|----------|--------|------|
| Transaction | **0 SOL** | Every transaction on ER |
| Session | 0.0003 SOL | On undelegation |
| Commit | 0.0001 SOL | Each state commit to base layer |

Session and commit fees are paid by the delegator (your server or backend), not the end user.

## Enable Gasless

**CLI**:

```bash
mb-console project configure my-game --gasless
```

**Web**: Project Settings → Features → toggle "Gasless" on.

**MCP**: Use `configure_project` with `gasless: true`.

Gasless is enabled by default on public ER nodes. The configuration flag in the Console is for tracking and visibility purposes.

## Cost Estimation

The Console tracks estimated costs for your project:

```bash
mb-console monitor costs --project my-game
```

Output:

```json
{
  "transactions": { "count": 12450, "cost": 0 },
  "commits": { "count": 8, "cost": 0.0008 },
  "sessions": { "count": 2, "cost": 0.0006 },
  "total": 0.0014,
  "period": "30d"
}
```

**Web**: Project → Monitoring → "Costs" tab.

## Dedicated Nodes

For high-throughput applications, MagicBlock offers dedicated ER nodes with a minimal fee of **0.0000005 SOL** per transaction.

## Next Steps

- [Privacy Mode](/docs/features/privacy) — confidential transactions
- [ER Lifecycle](/docs/er-lifecycle) — how delegation and commits work
