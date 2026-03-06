---
layout: docs
title: Cranks
description: Schedule automatic transaction execution on Ephemeral Rollups.
section: features
---

# Cranks — Scheduled Execution

Cranks allow you to schedule transactions that execute automatically at defined intervals on an Ephemeral Rollup. This is useful for game loops, periodic state updates, or any recurring on-chain operation.

## Enable Cranks

**CLI**:

```bash
mb-console project configure my-game --cranks
```

**Web**: Project Settings → Features → toggle "Cranks" on.

## Create a Crank

### CLI

```bash
mb-console crank create \
  --interval 5000 \
  --iterations 100 \
  --project my-game
```

Parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `--interval` | ms | Time between executions |
| `--iterations` | number | Total number of executions (0 = infinite) |
| `--project` | string | Target project |

### Web

Project → Cranks → "New Crank" → configure interval and iteration count → confirm.

### MCP

Use the `create_crank` tool:

> "Set up a crank that runs every 5 seconds for 100 iterations in my-game"

## List Cranks

```bash
mb-console crank list --project my-game
```

Output:

```
ID       Interval   Iterations   Executed   Status
crank_1  5000ms     100          42         running
crank_2  10000ms    0 (∞)        1,204      running
crank_3  1000ms     500          500        completed
```

## Stop a Crank

```bash
mb-console crank stop <CRANK_ID> --project my-game
```

## How It Works

Cranks are implemented as scheduled tasks on the ER validator:

1. You define a task with `task_id`, `execution_interval_millis`, and `iterations`
2. The instruction is serialized and submitted to the Magic Program
3. The ER validator executes the instruction at each interval
4. Execution continues until the iteration count is reached or the crank is stopped

## Use Cases

- **Game loops**: update game state every tick (e.g., every 100ms)
- **Price updates**: sync oracle data at regular intervals
- **Cleanup jobs**: expire stale sessions, process queued actions
- **Reward distribution**: periodic reward calculations

## Cost

Crank executions on ER are **gasless** (zero transaction fee per execution). You only pay the standard session and commit fees.

## Monitoring

```bash
mb-console monitor --project my-game
```

The Cranks tab shows:
- Active cranks and their status
- Execution count and success rate
- Next scheduled execution

## Next Steps

- [Oracle](/docs/features/oracle) — real-time price feeds
- [Gasless Transactions](/docs/features/gasless) — zero-fee execution
