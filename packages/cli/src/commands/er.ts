import type { Command } from 'commander';
import type { ConsoleClient } from '@magicblock-console/core';
import { printJson, printSuccess, printError, printTable } from '../utils/output.js';

export function registerErCommands(program: Command, client: ConsoleClient): void {
  const er = program
    .command('er')
    .description('Ephemeral Rollup lifecycle management');

  // -- delegate --
  er
    .command('delegate <account>')
    .description('Delegate an account to an Ephemeral Rollup')
    .requiredOption('--project <name>', 'Project name')
    .action(async (account: string, opts: { project: string }) => {
      try {
        const result = await client.er.delegate({
          account,
          project: opts.project,
        });
        printSuccess(`Account ${account} delegated`);
        printJson(result);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- undelegate --
  er
    .command('undelegate <account>')
    .description('Undelegate an account from an Ephemeral Rollup')
    .requiredOption('--project <name>', 'Project name')
    .action(async (account: string, opts: { project: string }) => {
      try {
        const result = await client.er.undelegate({
          account,
          project: opts.project,
        });
        printSuccess(`Account ${account} undelegated`);
        printJson(result);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- commit --
  er
    .command('commit <account>')
    .description('Commit ER state back to the base layer')
    .requiredOption('--project <name>', 'Project name')
    .action(async (account: string, opts: { project: string }) => {
      try {
        const result = await client.er.commit({
          account,
          project: opts.project,
        });
        printSuccess(`Account ${account} committed`);
        printJson(result);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- status --
  er
    .command('status <account>')
    .description('Check delegation status of an account')
    .action(async (account: string) => {
      try {
        const result = await client.er.status(account);
        printJson(result);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- list --
  er
    .command('list')
    .description('List delegated accounts for a project')
    .requiredOption('--project <name>', 'Project name')
    .action(async (opts: { project: string }) => {
      try {
        const accounts = await client.er.accounts(opts.project);
        printTable(
          accounts.map((a) => ({
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
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- diff --
  er
    .command('diff <account>')
    .description('Show state diff between base layer and ER')
    .action(async (account: string) => {
      try {
        const result = await client.er.diff(account);
        printJson(result);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });
}
