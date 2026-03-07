---
layout: docs
title: MCP Reference
description: Complete tool reference for the MagicBlock Console MCP Server.
section: reference
---

# MCP Server Reference

The MagicBlock Console MCP Server exposes Ephemeral Rollup management as tools for AI agents. Any MCP-compatible client can use these tools to create, configure, and monitor ERs.

## Setup

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "magicblock-console": {
      "command": "npx",
      "args": ["@magicblock-console/mcp"],
      "env": {
        "MB_KEYPAIR_PATH": "~/.config/solana/id.json"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MB_KEYPAIR_PATH` | No | Path to Solana keypair JSON file. If not set, runs in simulated mode |
| `MB_NETWORK` | No | Network: `devnet` (default), `mainnet` |

## Tools

### Project Management

#### `create_project`

Create a new project with ER configuration.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | Yes | Project name |
| `region` | string | No | Region: `us`, `eu`, `asia`. Default: `us` |

**Example:**

```
Agent: I'll create a new project called "my-game" in the EU region.
[calls create_project with name="my-game", region="eu"]
```

#### `list_projects`

List all projects and their status. No parameters.

#### `get_project`

Get details of a specific project.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | Yes | Project name |

#### `configure_project`

Update feature configuration for a project.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | Yes | Project name |
| `gasless` | boolean | No | Enable gasless transactions |
| `privacy` | boolean | No | Enable privacy via TEE |
| `vrf` | boolean | No | Enable verifiable randomness |
| `cranks` | boolean | No | Enable automated execution |
| `oracle` | boolean | No | Enable oracle price feeds |

**Example:**

```
Agent: I'll configure your project with gasless and VRF enabled.
[calls configure_project with name="my-game", gasless=true, vrf=true]
```

#### `delete_project`

Delete a project.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | Yes | Project name |

### ER Lifecycle

#### `delegate_account`

Delegate a Solana account to an Ephemeral Rollup for high-speed execution.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `account` | string | Yes | Account public key |
| `project` | string | Yes | Project name |
| `ownerProgram` | string | No | Owner program ID (if delegating a PDA) |

#### `undelegate_account`

Undelegate an account from an Ephemeral Rollup — final commit and return to Solana base layer.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `account` | string | Yes | Account public key |
| `project` | string | Yes | Project name |
| `ownerProgram` | string | No | Owner program ID (if undelegating a PDA) |

#### `commit_account`

Commit the current ER state of a delegated account back to the Solana base layer.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `account` | string | Yes | Account public key |
| `project` | string | Yes | Project name |

#### `get_delegation_status`

Check whether an account is currently delegated to an Ephemeral Rollup.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `account` | string | Yes | Account public key |

**Returns:** Delegation status, project name (if delegated), and ER region.

#### `list_delegated_accounts`

List all accounts currently delegated to a project.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |

#### `get_state_diff`

Compare the base layer and Ephemeral Rollup state of a delegated account to see what changed.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `account` | string | Yes | Account public key |

**Returns:** Field-by-field diff showing pre-ER and current ER state.

### Features

#### `request_vrf`

Request verifiable randomness (VRF) for a project. Returns 32 bytes of cryptographic randomness with proof.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |

#### `create_crank`

Schedule automatic execution for a project.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `intervalMs` | number | Yes | Interval between executions in milliseconds |
| `iterations` | number | No | Number of iterations (0 or omitted = infinite) |

#### `get_price_feed`

Get current price from an oracle feed (Pyth Lazer).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `feed` | string | Yes | Price pair (e.g., `SOL/USD`, `BTC/USD`, `ETH/USD`, `USDC/USD`) |

### Monitoring

#### `get_project_status`

Get operational status of a project including features, delegated accounts, uptime, and transaction count.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |

**Returns:** Status, enabled features, active accounts, transaction count, and uptime.

#### `get_project_costs`

Get cost breakdown for a project (transactions, commits, sessions) over a given period.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `period` | string | No | Time period: `7d`, `30d`, `90d` (default: `30d`) |

#### `get_project_logs`

Get recent log entries for a project, newest first.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `limit` | number | No | Number of log entries to return (default: 50) |

## Example Conversations

### Create and configure a project

> **User**: "Set up a new project called 'my-game' in the EU region with gasless transactions and VRF enabled"
>
> **Agent**:
> 1. Calls `create_project` with name="my-game", region="eu"
> 2. Calls `configure_project` with name="my-game", gasless=true, vrf=true
> 3. Returns confirmation: "Project 'my-game' created in EU with gasless and VRF enabled."

### Delegate account and check status

> **User**: "Delegate my account ABC123 to my-game and show me the current status"
>
> **Agent**:
> 1. Calls `delegate_account` with account="ABC123", project="my-game"
> 2. Calls `get_project_status` with project="my-game"
> 3. Returns delegation confirmation and project status.

### Monitor costs and performance

> **User**: "What did my-game cost over the last 7 days?"
>
> **Agent**:
> 1. Calls `get_project_costs` with project="my-game", period="7d"
> 2. Returns breakdown by transaction fees, commit fees, and session fees.
