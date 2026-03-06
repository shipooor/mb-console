import type { Command } from 'commander';
import type { ConsoleClient } from '@magicblock-console/core';
import { printJson, printError } from '../utils/output.js';

export function registerVrfCommands(program: Command, client: ConsoleClient): void {
  const vrfCmd = program
    .command('vrf')
    .description('Verifiable Random Function operations');

  // -- request --
  vrfCmd
    .command('request')
    .description('Request verifiable randomness')
    .requiredOption('--project <name>', 'Project name')
    .action(async (opts: { project: string }) => {
      try {
        const result = await client.vrf.request({ project: opts.project });
        printJson(result);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });
}
