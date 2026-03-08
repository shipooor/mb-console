---
layout: docs
title: Privacy Mode
description: Confidential state and private transactions using Trusted Execution Environments.
section: features
---

# Privacy Mode

Private Ephemeral Rollups (PER) run inside Intel TDX Trusted Execution Environments, providing confidential state that is invisible to validators, observers, and other users.

## How It Works

In a standard Ephemeral Rollup, account state is visible to the validator. With PER, the ER runs inside a hardware-secured enclave:

- **State is encrypted at rest** — only the TEE can read it
- **Transactions are processed inside the enclave** — no observer can see intermediate state
- **Programs define access rules** — fine-grained read/write permissions per account

The PER validator runs at `tee.magicblock.app` with pubkey `MTEWGuqxUpYZGFJQcp8tLN7x5v9BSeoFHYWQQ3n3xzo`.

## Enable Privacy

**CLI**:

```bash
mb-console project configure my-game --privacy
```

**Web**: Project Settings → Features → toggle "Privacy (TEE)" on.

This routes delegations to the TEE-enabled validator instead of a standard ER node.

## Private Token Operations

The Console wraps the PER API for common token operations:

### Deposit

Move SPL tokens into a private vault:

```bash
mb-console privacy deposit \
  --token <symbol> \
  --amount 100 \
  --project my-game
```

### Transfer

Transfer tokens privately within the PER:

```bash
mb-console privacy transfer \
  --token <symbol> \
  --amount 50 \
  --to <RECIPIENT_WALLET> \
  --project my-game
```

### Withdraw

Move tokens back to the public Solana base layer:

```bash
mb-console privacy withdraw \
  --token <symbol> \
  --amount 25 \
  --project my-game
```

Withdrawal is a two-step process:
1. **Prepare** — undelegates the vault account from the PER
2. **Withdraw** — transfers tokens back to your wallet on Solana

## Authentication

PER operations require wallet signature authentication:

1. Sign a message with your wallet
2. Receive an auth token
3. Token is included in all PER API requests

The Console handles this automatically. On CLI, the auth token is cached in your session.

## Monitoring

```bash
mb-console monitor status --project my-game
```

The privacy tab shows:
- Private vault balances
- Transfer history (your transfers only)
- Deposit/withdrawal status

**Web**: Project → Privacy → vault overview and transaction history.

## Limitations

- Only SPL tokens can be deposited into private vaults
- PER is currently available on devnet only
- TEE validator is in a single region (no region selection)

## Next Steps

- [VRF](/docs/features/vrf) — verifiable randomness
- [ER Lifecycle](/docs/er-lifecycle) — delegation and commits
