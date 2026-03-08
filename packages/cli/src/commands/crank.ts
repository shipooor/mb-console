import type { Command } from 'commander';
import type { ConsoleClient } from '@magicblock-console/core';
import { printJson, printSuccess, printError, printTable } from '../utils/output.js';

export function registerCrankCommands(program: Command, client: ConsoleClient): void {
  const crank = program
    .command('crank')
    .description('Automated crank (clockwork) operations');

  // -- create --
  crank
    .command('create')
    .description('Create a new crank')
    .requiredOption('--interval <ms>', 'Interval in milliseconds', parseInt)
    .option('--iterations <n>', 'Number of iterations (0 = infinite)', parseInt)
    .option('--account <pubkey>', 'Account to commit (enables real blockchain)')
    .requiredOption('--project <name>', 'Project name')
    .action(async (opts: { interval: number; iterations?: number; account?: string; project: string }) => {
      try {
        const result = await client.cranks.create({
          project: opts.project,
          intervalMs: opts.interval,
          iterations: opts.iterations,
          account: opts.account,
        });
        const badge = result.simulated ? ' (simulated)' : '';
        printSuccess(`Crank created${badge}: ${result.id}`);
        printJson(result);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- list --
  crank
    .command('list')
    .description('List cranks for a project')
    .requiredOption('--project <name>', 'Project name')
    .action(async (opts: { project: string }) => {
      try {
        const cranks = await client.cranks.list(opts.project);
        printTable(
          cranks.map((c) => ({
            id: c.id,
            interval: `${c.intervalMs}ms`,
            iterations: c.iterations === 0 ? 'infinite' : String(c.iterations),
            executed: String(c.executed),
            status: c.status,
            mode: c.simulated ? 'simulated' : 'live',
          })),
          [
            { header: 'ID', key: 'id' },
            { header: 'Interval', key: 'interval' },
            { header: 'Iterations', key: 'iterations' },
            { header: 'Executed', key: 'executed' },
            { header: 'Status', key: 'status' },
            { header: 'Mode', key: 'mode' },
          ],
        );
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- stop --
  crank
    .command('stop <id>')
    .description('Stop a running crank')
    .action(async (id: string) => {
      try {
        const result = await client.cranks.stop(id);
        printSuccess(`Crank ${id} stopped`);
        printJson(result);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });
}
