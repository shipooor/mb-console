import type { Command } from 'commander';
import type { ConsoleClient } from '@magicblock-console/core';
import { printJson, printError, printSuccess } from '../utils/output.js';

export function registerOracleCommands(program: Command, client: ConsoleClient): void {
  const oracle = program
    .command('oracle')
    .description('On-chain oracle price feeds');

  // -- price --
  oracle
    .command('price')
    .description('Get a price feed value')
    .requiredOption('--feed <pair>', 'Price feed pair (e.g. SOL/USD)')
    .requiredOption('--project <name>', 'Project name')
    .action(async (opts: { feed: string; project: string }) => {
      try {
        const result = await client.oracle.getPrice({
          project: opts.project,
          feed: opts.feed,
        });
        printJson(result);
        if (result.simulated) {
          printSuccess('(simulated mode — no blockchain connection)');
        }
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });
}
