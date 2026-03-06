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
| `MB_KEYPAIR_PATH` | Yes | Path to Solana keypair JSON file |
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
| `features` | object | No | Feature flags |

Features object:

```json
{
  "gasless": true,
  "privacy": false,
  "vrf": true,
  "cranks": false,
  "oracle": false
}
```

#### `list_projects`

List all projects and their status. No parameters.

#### `configure_er`

Update feature configuration for a project.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `features` | object | Yes | Feature flags to update |

#### `delete_project`

Delete a project.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |

### ER Lifecycle

#### `delegate_account`

Delegate a Solana account to an Ephemeral Rollup.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `account` | string | Yes | Account public key |
| `project` | string | Yes | Project name |

#### `commit_state`

Commit ER state to the Solana base layer.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `account` | string | Yes | Account public key (or `"all"`) |
| `project` | string | Yes | Project name |

#### `undelegate_account`

Undelegate an account — final commit and return to Solana.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `account` | string | Yes | Account public key (or `"all"`) |
| `project` | string | Yes | Project name |

#### `get_delegation_status`

Check whether an account is delegated and to which ER.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `account` | string | Yes | Account public key |

#### `get_er_status`

Get ER status and health for a project.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |

### Features

#### `request_vrf`

Generate verifiable random numbers.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |

**Returns:** Random bytes, proof, and latency.

#### `deposit_private`

Deposit SPL tokens into a private vault (PER).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `token` | string | Yes | Token mint address |
| `amount` | number | Yes | Amount to deposit |

#### `transfer_private`

Transfer tokens privately within PER.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `token` | string | Yes | Token mint address |
| `amount` | number | Yes | Amount to transfer |
| `to` | string | Yes | Recipient wallet address |

#### `withdraw_private`

Withdraw tokens from private vault to Solana.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `token` | string | Yes | Token mint address |
| `amount` | number | Yes | Amount to withdraw |

#### `create_crank`

Schedule automatic execution.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `intervalMs` | number | Yes | Interval between executions in milliseconds |
| `iterations` | number | No | Number of iterations (0 = infinite) |

#### `get_price_feed`

Get current price from an oracle feed.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `feed` | string | Yes | Price pair (e.g., `SOL/USD`) |

### Monitoring

#### `get_costs`

Get cost breakdown for a project.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |

#### `get_logs`

Get recent ER events.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `limit` | number | No | Number of events (default: 50) |

## Example Conversations

### Create and configure a project

> **User**: "Set up a new game project in EU with gasless and VRF"
>
> **Agent**: Creates project, enables gasless and VRF features, reports the configuration.

### Delegate and monitor

> **User**: "Delegate account ABC123 to my-game and show me the status"
>
> **Agent**: Delegates the account, then checks ER status and reports delegation details.

### Privacy workflow

> **User**: "Deposit 100 USDC into the private vault for my-game"
>
> **Agent**: Calls `deposit_private` with the USDC mint and amount, reports the transaction.
