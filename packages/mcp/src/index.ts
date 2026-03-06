#!/usr/bin/env node
// @ts-nocheck — zod v4 + MCP SDK generics cause OOM during type-check

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { createClient, MemoryStorage, VERSION } from '@magicblock-console/core';
import type { Network } from '@magicblock-console/core';

// ---------------------------------------------------------------------------
// JSON Serializer
// ---------------------------------------------------------------------------

function jsonReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Uint8Array) return Buffer.from(value).toString('hex');
  return value;
}

function toJson(value: unknown): string {
  return JSON.stringify(value, jsonReplacer, 2);
}

function ok(data: unknown) {
  return { content: [{ type: 'text' as const, text: toJson(data) }] };
}

function fail(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  return {
    content: [{ type: 'text' as const, text: `Error: ${msg}` }],
    isError: true as const,
  };
}

// ---------------------------------------------------------------------------
// Client Setup
// ---------------------------------------------------------------------------

const client = createClient({
  network: (process.env['MB_NETWORK'] as Network) ?? 'devnet',
  keypairPath: process.env['MB_KEYPAIR_PATH'],
  storage: new MemoryStorage(),
});

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: 'magicblock-console',
  version: VERSION,
});

// ---------------------------------------------------------------------------
// Project Tools
// ---------------------------------------------------------------------------

server.tool(
  'create_project',
  'Create a new MagicBlock project for managing Ephemeral Rollups',
  { name: z.string(), region: z.enum(['us', 'eu', 'asia']).optional() },
  async ({ name, region }) => {
    try {
      return ok(await client.projects.create({ name, region }));
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'list_projects',
  'List all MagicBlock projects',
  {},
  async () => {
    try {
      return ok(await client.projects.list());
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'get_project',
  'Get details of a specific project',
  { name: z.string() },
  async ({ name }) => {
    try {
      return ok(await client.projects.get(name));
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'configure_project',
  'Configure project features (gasless, privacy, vrf, cranks, oracle)',
  {
    name: z.string(),
    gasless: z.boolean().optional(),
    privacy: z.boolean().optional(),
    vrf: z.boolean().optional(),
    cranks: z.boolean().optional(),
    oracle: z.boolean().optional(),
  },
  async ({ name, ...features }) => {
    try {
      return ok(await client.projects.configure(name, { features }));
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'delete_project',
  'Delete a project',
  { name: z.string() },
  async ({ name }) => {
    try {
      await client.projects.delete(name);
      return ok({ message: `Project "${name}" deleted.` });
    } catch (err) { return fail(err); }
  },
);

// ---------------------------------------------------------------------------
// ER Tools
// ---------------------------------------------------------------------------

server.tool(
  'delegate_account',
  'Delegate a Solana account to an Ephemeral Rollup for high-speed execution',
  { account: z.string(), project: z.string() },
  async ({ account, project }) => {
    try {
      return ok(await client.er.delegate({ account, project }));
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'undelegate_account',
  'Undelegate a Solana account from an Ephemeral Rollup, returning it to the base layer',
  { account: z.string(), project: z.string() },
  async ({ account, project }) => {
    try {
      return ok(await client.er.undelegate({ account, project }));
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'commit_account',
  'Commit the current ER state of a delegated account back to the Solana base layer',
  { account: z.string(), project: z.string() },
  async ({ account, project }) => {
    try {
      return ok(await client.er.commit({ account, project }));
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'get_delegation_status',
  'Check whether a Solana account is currently delegated to an Ephemeral Rollup',
  { account: z.string() },
  async ({ account }) => {
    try {
      return ok(await client.er.status(account));
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'list_delegated_accounts',
  'List all accounts currently delegated to a project',
  { project: z.string() },
  async ({ project }) => {
    try {
      return ok(await client.er.accounts(project));
    } catch (err) { return fail(err); }
  },
);

// ---------------------------------------------------------------------------
// Feature Tools
// ---------------------------------------------------------------------------

server.tool(
  'request_vrf',
  'Request verifiable randomness (VRF) for a project. Returns 32 bytes of cryptographic randomness with proof.',
  { project: z.string() },
  async ({ project }) => {
    try {
      return ok(await client.vrf.request({ project }));
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'create_crank',
  'Create a crank (automated periodic execution) for a project',
  {
    project: z.string(),
    intervalMs: z.number(),
    iterations: z.number().optional(),
  },
  async ({ project, intervalMs, iterations }) => {
    try {
      return ok(await client.cranks.create({ project, intervalMs, iterations }));
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'get_price_feed',
  'Get a real-time price feed from the Pyth Lazer oracle (SOL/USD, BTC/USD, ETH/USD, USDC/USD)',
  { project: z.string(), feed: z.string() },
  async ({ project, feed }) => {
    try {
      return ok(await client.oracle.getPrice({ project, feed }));
    } catch (err) { return fail(err); }
  },
);

// ---------------------------------------------------------------------------
// Monitor Tools
// ---------------------------------------------------------------------------

server.tool(
  'get_project_status',
  'Get operational status of a project including features, delegated accounts, uptime, and transaction count',
  { project: z.string() },
  async ({ project }) => {
    try {
      return ok(await client.monitor.status(project));
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'get_project_costs',
  'Get cost breakdown for a project (transactions, commits, sessions) over a given period',
  { project: z.string(), period: z.string().optional() },
  async ({ project, period }) => {
    try {
      return ok(await client.monitor.costs(project, period));
    } catch (err) { return fail(err); }
  },
);

server.tool(
  'get_project_logs',
  'Get recent log entries for a project, newest first',
  { project: z.string(), limit: z.number().optional() },
  async ({ project, limit }) => {
    try {
      return ok(await client.monitor.logs(project, limit));
    } catch (err) { return fail(err); }
  },
);

// ---------------------------------------------------------------------------
// Server Startup
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('MCP server failed to start:', err);
  process.exit(1);
});
