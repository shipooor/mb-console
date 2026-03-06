import type { Storage } from './storage.js';
import type {
  Network,
  Project,
  PrivacyDepositOptions,
  PrivacyTransferOptions,
  PrivacyWithdrawOptions,
} from './types.js';
import type { PrivacyNamespace } from './client.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Load a project from storage and validate that the privacy feature is enabled.
 */
async function requirePrivacyEnabled(storage: Storage, project: string): Promise<Project> {
  const data = await storage.get(`project:${project}`);
  if (!data) {
    throw new Error(`Project "${project}" not found`);
  }
  const parsed = JSON.parse(data) as Project;
  if (!parsed.features.privacy) {
    throw new Error(
      `Feature "privacy" is not enabled for project "${project}". ` +
        `Enable it with: client.projects.configure("${project}", { features: { privacy: true } })`,
    );
  }
  return parsed;
}

/**
 * Generate a realistic-looking base58 transaction signature.
 *
 * NOTE: Simulated for hackathon demo purposes.
 */
function generateSignature(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let sig = '';
  for (let i = 0; i < 88; i++) {
    sig += chars[Math.floor(Math.random() * chars.length)];
  }
  return sig;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a fully-functional `PrivacyNamespace` backed by the given Storage.
 *
 * All three operations (deposit, transfer, withdraw) validate that the
 * project exists and has the privacy feature enabled, then return a
 * simulated transaction signature.
 *
 * NOTE: In a real implementation these would construct and submit
 * confidential transfer instructions to the MagicBlock privacy layer.
 * The current implementation is simulated for hackathon demo purposes.
 */
export function createPrivacyNamespace(
  storage: Storage,
  _network: Network,
): PrivacyNamespace {
  return {
    async deposit(options: PrivacyDepositOptions): Promise<string> {
      await requirePrivacyEnabled(storage, options.project);

      if (options.amount <= 0) {
        throw new Error('Deposit amount must be greater than 0');
      }

      return generateSignature();
    },

    async transfer(options: PrivacyTransferOptions): Promise<string> {
      await requirePrivacyEnabled(storage, options.project);

      if (options.amount <= 0) {
        throw new Error('Transfer amount must be greater than 0');
      }

      if (!options.to) {
        throw new Error('Transfer recipient address is required');
      }

      return generateSignature();
    },

    async withdraw(options: PrivacyWithdrawOptions): Promise<string> {
      await requirePrivacyEnabled(storage, options.project);

      if (options.amount <= 0) {
        throw new Error('Withdraw amount must be greater than 0');
      }

      return generateSignature();
    },
  };
}
