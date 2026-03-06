import type { Command } from 'commander';
import type { ConsoleClient } from '@magicblock-console/core';
import { printJson, printError, printTable } from '../utils/output.js';

export function registerMonitorCommands(program: Command, client: ConsoleClient): void {
  const monitor = program
    .command('monitor')
    .description('Project monitoring and observability');

  // -- status --
  monitor
    .command('status')
    .description('Show project status overview')
    .requiredOption('--project <name>', 'Project name')
    .action(async (opts: { project: string }) => {
      try {
        const status = await client.monitor.status(opts.project);

        console.log(`Project:      ${status.project}`);
        console.log(`Region:       ${status.region}`);
        console.log(`Uptime:       ${status.uptime}%`);
        console.log(`Transactions: ${status.transactionCount}`);
        console.log();

        // Feature flags
        const enabledFeatures = Object.entries(status.features)
          .filter(([, v]) => v)
          .map(([k]) => k);
        console.log(
          `Features:     ${enabledFeatures.length > 0 ? enabledFeatures.join(', ') : 'none'}`,
        );
        console.log();

        // Delegated accounts
        if (status.accounts.length > 0) {
          console.log(`Delegated accounts (${status.accounts.length}):`);
          printTable(
            status.accounts.map((a) => ({
              address: a.address,
              validator: a.validator,
              delegatedAt: a.delegatedAt.toISOString(),
            })),
            [
              { header: 'Address', key: 'address' },
              { header: 'Validator', key: 'validator' },
              { header: 'Delegated At', key: 'delegatedAt' },
            ],
          );
        } else {
          console.log('Delegated accounts: none');
        }
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- costs --
  monitor
    .command('costs')
    .description('Show cost breakdown for a project')
    .requiredOption('--project <name>', 'Project name')
    .option('--period <period>', 'Time period: 7d, 30d, 90d', '30d')
    .action(async (opts: { project: string; period: string }) => {
      try {
        const costs = await client.monitor.costs(opts.project, opts.period);
        printJson(costs);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- logs --
  monitor
    .command('logs')
    .description('Show project logs')
    .requiredOption('--project <name>', 'Project name')
    .option('--limit <n>', 'Number of log entries to show', parseInt)
    .action(async (opts: { project: string; limit?: number }) => {
      try {
        const logs = await client.monitor.logs(opts.project, opts.limit);

        if (logs.length === 0) {
          console.log('(no log entries)');
          return;
        }

        printTable(
          logs.map((l) => ({
            timestamp: l.timestamp.toISOString(),
            type: l.type,
            message: l.message,
          })),
          [
            { header: 'Timestamp', key: 'timestamp' },
            { header: 'Type', key: 'type' },
            { header: 'Message', key: 'message' },
          ],
        );
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });
}
