---
layout: docs
title: ER Lifecycle
description: How Ephemeral Rollups work — delegation, execution, state commits, and undelegation.
section: guides
---

# Ephemeral Rollup Lifecycle

An Ephemeral Rollup (ER) is a temporary high-speed execution environment on Solana. Accounts are delegated to an ER, transactions execute with near-instant finality, and state is committed back to the Solana base layer.

## Lifecycle Overview

```
  Solana Base Layer              Ephemeral Rollup
  ─────────────────              ────────────────
        │
   1. DELEGATE ──────────────────────► Account cloned
        │                                    │
        │                             2. EXECUTE
        │                                transactions
        │                                (gasless, fast)
        │                                    │
   3. COMMIT ◄───────────────────────── State synced
        │                                    │
        │                             4. Continue or...
        │                                    │
   5. UNDELEGATE ◄───────────────────── Final commit
        │                                  + return
   Account restored
   with latest state
```

## 1. Delegate

Delegation transfers ownership of a Solana account to the MagicBlock Delegation Program. The account is then cloned to the target ER validator.

### Using the Console

**CLI**:

```bash
mb-console er delegate <ACCOUNT_ADDRESS> --project my-game
```

The ER region is determined by the project configuration.

**Web**: Project page → Accounts → "Delegate Account" → paste address → confirm.

**MCP**: `delegate_account` tool with account address and project name.

### What Happens

1. A transaction is sent to the Delegation Program (`DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh`)
2. Account ownership transfers to the Delegation Program
3. The ER validator clones the account state
4. The account is now writable on the ER

### Delegation Status

Check whether an account is delegated:

```bash
mb-console er status <ACCOUNT_ADDRESS>
```

Returns:

```json
{
  "isDelegated": true,
  "validator": "devnet-us.magicblock.app",
  "validatorPubkey": "MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd",
  "delegatedAt": "2026-03-06T12:00:00Z"
}
```

## 2. Execute

Once delegated, transactions targeting the account are routed to the ER via the Magic Router. Execution is fast and optionally gasless.

### Magic Router

The Magic Router automatically detects whether an account is delegated and routes transactions accordingly:

- **Delegated accounts** → routed to ER
- **Regular accounts** → routed to Solana

Endpoint: `https://devnet-router.magicblock.app`

You don't need to change your transaction code. Point your connection to the Magic Router and it handles routing transparently.

### Performance

| Metric | Solana | Ephemeral Rollup |
|--------|--------|-----------------|
| Block time | 400ms | ~50ms |
| Transaction fee | 0.000005 SOL | 0 (gasless) |
| Confirmation | ~500ms | ~100ms |

## 3. Commit

Committing writes the current ER state back to the Solana base layer. This is how ER state becomes finalized on-chain.

```bash
mb-console er commit <ACCOUNT_ADDRESS> --project my-game
```

### Commit Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| Manual | Explicit commit via console | On-demand sync |
| Periodic | Auto-commit at intervals | Background sync |
| On Undelegate | Automatic with undelegation | Session end |

### Cost

Each commit costs **0.0001 SOL** (paid on base layer).

## 4. Undelegate

Undelegation performs a final commit and returns account ownership to the original program.

```bash
mb-console er undelegate <ACCOUNT_ADDRESS> --project my-game
```

After undelegation:
- Account state is finalized on Solana
- Account is writable on Solana again
- ER no longer tracks this account

### Session Fee

Each ER session (delegate → undelegate cycle) costs **0.0003 SOL**.

## Account State Diff

The Console provides a diff view between ER state and base layer state:

```bash
mb-console er diff <ACCOUNT_ADDRESS>
```

This shows what data has changed on the ER since the last commit.

**Web**: Project → Accounts → click account → "State Diff" tab.

## Managing Multiple Accounts

Delegate accounts one at a time and list all delegated accounts:

```bash
mb-console er delegate <ACCOUNT_1> --project my-game
mb-console er delegate <ACCOUNT_2> --project my-game

mb-console er list --project my-game
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Account not found | Invalid address | Verify the account exists on Solana |
| Already delegated | Account is on another ER | Undelegate first, then re-delegate |
| Insufficient funds | Not enough SOL for fees | Fund wallet with devnet SOL |
| Validator unavailable | ER node is down | Try a different region |

## Next Steps

- [Gasless Transactions](/docs/features/gasless) — execute without fees
- [Privacy Mode](/docs/features/privacy) — confidential execution
- [VRF](/docs/features/vrf) — verifiable randomness on ER
