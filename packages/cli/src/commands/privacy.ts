import type { Command } from 'commander';
import type { ConsoleClient } from '@magicblock-console/core';
import { assertPubkey } from '@magicblock-console/core';
import { printSuccess, printError } from '../utils/output.js';

function validateAmount(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive finite number`);
  }
}

function formatResult(operation: string, signature: string, simulated: boolean): string {
  const badge = simulated ? ' (simulated)' : '';
  return `${operation} successful${badge}. Signature: ${signature}`;
}

export function registerPrivacyCommands(program: Command, client: ConsoleClient): void {
  const privacy = program
    .command('privacy')
    .description('Confidential token operations');

  // -- deposit --
  privacy
    .command('deposit')
    .description('Deposit tokens into the privacy layer')
    .requiredOption('--token <mint>', 'Token symbol or mint address')
    .requiredOption('--amount <n>', 'Amount to deposit', parseFloat)
    .requiredOption('--project <name>', 'Project name')
    .option('--mint <address>', 'Explicit SPL mint address')
    .action(async (opts: { token: string; amount: number; project: string; mint?: string }) => {
      try {
        validateAmount(opts.amount, 'Deposit amount');
        const result = await client.privacy.deposit({
          project: opts.project,
          token: opts.token,
          amount: opts.amount,
          mint: opts.mint,
        });
        printSuccess(formatResult('Deposit', result.signature, result.simulated));
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- transfer --
  privacy
    .command('transfer')
    .description('Transfer tokens confidentially')
    .requiredOption('--token <mint>', 'Token symbol or mint address')
    .requiredOption('--amount <n>', 'Amount to transfer', parseFloat)
    .requiredOption('--to <wallet>', 'Recipient wallet address')
    .requiredOption('--project <name>', 'Project name')
    .option('--mint <address>', 'Explicit SPL mint address')
    .action(async (opts: { token: string; amount: number; to: string; project: string; mint?: string }) => {
      try {
        validateAmount(opts.amount, 'Transfer amount');
        assertPubkey(opts.to, 'recipient');
        const result = await client.privacy.transfer({
          project: opts.project,
          token: opts.token,
          amount: opts.amount,
          to: opts.to,
          mint: opts.mint,
        });
        printSuccess(formatResult('Transfer', result.signature, result.simulated));
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });

  // -- withdraw --
  privacy
    .command('withdraw')
    .description('Withdraw tokens from the privacy layer')
    .requiredOption('--token <mint>', 'Token symbol or mint address')
    .requiredOption('--amount <n>', 'Amount to withdraw', parseFloat)
    .requiredOption('--project <name>', 'Project name')
    .option('--mint <address>', 'Explicit SPL mint address')
    .action(async (opts: { token: string; amount: number; project: string; mint?: string }) => {
      try {
        validateAmount(opts.amount, 'Withdraw amount');
        const result = await client.privacy.withdraw({
          project: opts.project,
          token: opts.token,
          amount: opts.amount,
          mint: opts.mint,
        });
        printSuccess(formatResult('Withdraw', result.signature, result.simulated));
      } catch (err) {
        printError(err instanceof Error ? err.message : String(err));
      }
    });
}
