#!/usr/bin/env node
import { Command } from 'commander';
import { VERSION, createClient, FileStorage } from '@magicblock-console/core';
import type { Network } from '@magicblock-console/core';
import { registerProjectCommands } from './commands/project.js';
import { registerErCommands } from './commands/er.js';
import { registerVrfCommands } from './commands/vrf.js';
import { registerPrivacyCommands } from './commands/privacy.js';
import { registerCrankCommands } from './commands/crank.js';
import { registerOracleCommands } from './commands/oracle.js';
import { registerMonitorCommands } from './commands/monitor.js';
import { resolve } from 'node:path';
import { homedir } from 'node:os';

async function main() {
  const program = new Command();

  program
    .name('mb-console')
    .description('MagicBlock Console \u2014 manage Ephemeral Rollups on Solana')
    .version(VERSION);

  // Validate network from environment
  const rawNetwork = process.env['MB_NETWORK'] ?? 'devnet';
  if (rawNetwork !== 'devnet' && rawNetwork !== 'mainnet') {
    console.error(`Invalid MB_NETWORK: "${rawNetwork}". Must be "devnet" or "mainnet".`);
    process.exit(1);
  }

  // Create client with FileStorage for persistent local state
  const client = createClient({
    network: rawNetwork as Network,
    storage: new FileStorage(),
  });

  // Attempt to connect with a Solana keypair for real blockchain operations.
  const explicitKeypair = process.env['MB_KEYPAIR_PATH'];
  const keypairPath = explicitKeypair ?? resolve(homedir(), '.config/solana/id.json');

  try {
    await client.connectWithKeypair(keypairPath);
  } catch (err) {
    if (explicitKeypair) {
      // User explicitly set MB_KEYPAIR_PATH — warn about the failure
      console.error(
        `Warning: could not load keypair from MB_KEYPAIR_PATH="${explicitKeypair}": ${
          err instanceof Error ? err.message : String(err)
        }. Running in simulated mode.`,
      );
    }
    // Default path not found — silently fall back to simulated mode
  }

  // Register all command groups
  registerProjectCommands(program, client);
  registerErCommands(program, client);
  registerVrfCommands(program, client);
  registerPrivacyCommands(program, client);
  registerCrankCommands(program, client);
  registerOracleCommands(program, client);
  registerMonitorCommands(program, client);

  program.parse();
}

main();
