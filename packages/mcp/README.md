# @magicblock-console/mcp

MCP Server for managing [MagicBlock Ephemeral Rollups](https://www.magicblock.gg/) on Solana. Enables AI agents to manage ER infrastructure from any MCP-compatible client (Claude, Cursor, etc.).

## Installation

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "magicblock-console": {
      "command": "npx",
      "args": ["@magicblock-console/mcp"]
    }
  }
}
```

For real blockchain operations, provide a keypair:

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

## Available Tools (22)

### Projects
| Tool | Description |
|------|-------------|
| `create_project` | Create a new project with ER configuration |
| `list_projects` | List all projects |
| `get_project` | Get project details |
| `configure_project` | Enable/disable features (gasless, privacy, vrf, cranks, oracle) |
| `delete_project` | Delete a project |

### ER Lifecycle
| Tool | Description |
|------|-------------|
| `delegate_account` | Delegate account to Ephemeral Rollup |
| `commit_account` | Commit ER state to Solana base layer |
| `undelegate_account` | Return account to Solana |
| `get_delegation_status` | Check delegation status |
| `list_delegated_accounts` | List delegated accounts |
| `get_state_diff` | Compare ER vs base layer state |

### Features
| Tool | Description |
|------|-------------|
| `request_vrf` | Request verifiable randomness |
| `create_crank` | Schedule automatic execution |
| `list_cranks` | List cranks |
| `stop_crank` | Stop a crank |
| `get_price_feed` | Get oracle price (SOL/USD, BTC/USD, etc.) |
| `deposit_private` | Deposit tokens to privacy layer (TEE) |
| `transfer_private` | Confidential token transfer |
| `withdraw_private` | Withdraw from privacy layer |

### Monitoring
| Tool | Description |
|------|-------------|
| `get_project_status` | Project status, uptime, tx count |
| `get_project_costs` | Cost breakdown by period |
| `get_project_logs` | Recent log entries |

## Example

> "Create a project called my-game in the US region with gasless and VRF enabled"

The agent will call `create_project` and `configure_project` to set everything up.

## Related Packages

- [`@magicblock-console/core`](https://www.npmjs.com/package/@magicblock-console/core) — Core SDK
- [`@magicblock-console/cli`](https://www.npmjs.com/package/@magicblock-console/cli) — Terminal interface

## License

MIT
