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

const program = new Command();

program
  .name('mb-console')
  .description('MagicBlock Console \u2014 manage Ephemeral Rollups on Solana')
  .version(VERSION);

// Create client with FileStorage for persistent local state
const client = createClient({
  network: (process.env['MB_NETWORK'] as Network) ?? 'devnet',
  storage: new FileStorage(),
});

// Register all command groups
registerProjectCommands(program, client);
registerErCommands(program, client);
registerVrfCommands(program, client);
registerPrivacyCommands(program, client);
registerCrankCommands(program, client);
registerOracleCommands(program, client);
registerMonitorCommands(program, client);

program.parse();
