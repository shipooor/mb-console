import type { Command } from 'commander';
import type { ConsoleClient } from '@magicblock-console/core';
import { printJson, printSuccess, printError, printTable } from '../utils/output.js';

export function registerProjectCommands(program: Command, client: ConsoleClient): void {
  const project = program
    .command('project')
    .description('Manage projects');

  // -- create --
  project
    .command('create <name>')
    .description('Create a new project')
    .option('--region <region>', 'Region: us, eu, asia', 'us')
    .action(async (name: string, opts: { region: string }) => {
      try {
        const result = await client.projects.create({
          name,
          region: opts.region as 'us' | 'eu' | 'asia',
        });
        printJson(result);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- list --
  project
    .command('list')
    .description('List all projects')
    .action(async () => {
      try {
        const projects = await client.projects.list();
        printTable(
          projects.map((p) => ({
            name: p.name,
            region: p.region,
            features: Object.entries(p.features)
              .filter(([, v]) => v)
              .map(([k]) => k)
              .join(', ') || 'none',
            created: p.createdAt.toISOString(),
          })),
          [
            { header: 'Name', key: 'name' },
            { header: 'Region', key: 'region' },
            { header: 'Features', key: 'features' },
            { header: 'Created', key: 'created' },
          ],
        );
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- get --
  project
    .command('get <name>')
    .description('Get project details')
    .action(async (name: string) => {
      try {
        const result = await client.projects.get(name);
        printJson(result);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- configure --
  project
    .command('configure <name>')
    .description('Configure project feature flags')
    .option('--gasless', 'Enable gasless transactions')
    .option('--no-gasless', 'Disable gasless transactions')
    .option('--vrf', 'Enable VRF')
    .option('--no-vrf', 'Disable VRF')
    .option('--privacy', 'Enable privacy')
    .option('--no-privacy', 'Disable privacy')
    .option('--cranks', 'Enable cranks')
    .option('--no-cranks', 'Disable cranks')
    .option('--oracle', 'Enable oracle')
    .option('--no-oracle', 'Disable oracle')
    .action(async (name: string, opts: Record<string, boolean>) => {
      try {
        const features: Record<string, boolean> = {};
        const flags = ['gasless', 'vrf', 'privacy', 'cranks', 'oracle'] as const;
        for (const flag of flags) {
          if (flag in opts) {
            features[flag] = opts[flag]!;
          }
        }

        const result = await client.projects.configure(name, { features });
        printJson(result);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- delete --
  project
    .command('delete <name>')
    .description('Delete a project')
    .action(async (name: string) => {
      try {
        await client.projects.delete(name);
        printSuccess(`Project "${name}" deleted`);
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });
}
