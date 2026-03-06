import type { Storage } from './storage.js';
import type {
  CommitOptions,
  CommitResult,
  DelegateOptions,
  DelegatedAccount,
  DelegationResult,
  DelegationStatus,
  Network,
  Region,
  StateDiff,
  UndelegateOptions,
} from './types.js';
import type { ErNamespace } from './client.js';
import { VALIDATORS, REGIONS } from './config.js';

// ---------------------------------------------------------------------------
// Key helpers
// ---------------------------------------------------------------------------

const DELEGATION_PREFIX = 'delegation:';
const ACCOUNT_INDEX_PREFIX = 'account-index:';

function delegationKey(account: string): string {
  return `${DELEGATION_PREFIX}${account}`;
}

/** Account index: stores a JSON array of delegated account addresses per project. */
function accountIndexKey(project: string): string {
  return `${ACCOUNT_INDEX_PREFIX}${project}`;
}

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

/** Serializable delegation record stored in Storage. */
interface DelegationRecord {
  account: string;
  project: string;
  validator: string;
  validatorPubkey: string;
  delegatedAt: string; // ISO string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a realistic-looking base58 transaction signature.
 *
 * NOTE: This is a simulated signature for hackathon purposes.
 * Real implementation would use the MagicBlock Delegation Program
 * to produce an actual on-chain transaction signature.
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
 * Create a fully-functional `ErNamespace` backed by the given Storage.
 *
 * Delegation records are persisted under `delegation:<account>` keys.
 * A per-project account index is maintained under `account-index:<project>`.
 *
 * The `resolveProjectRegion` callback is used to look up which region
 * (and therefore which validator) a project is deployed to. Typically
 * this delegates to `projects.get(name).region`.
 *
 * NOTE: All on-chain operations (delegate, undelegate, commit) are simulated.
 * The structure is ready for real Solana transaction logic to be plugged in.
 */
export function createErNamespace(
  storage: Storage,
  network: Network,
  resolveProjectRegion: (project: string) => Promise<Region>,
): ErNamespace {
  // Helper: read the account index for a project
  async function getAccountIndex(project: string): Promise<string[]> {
    const data = await storage.get(accountIndexKey(project));
    return data ? (JSON.parse(data) as string[]) : [];
  }

  // Helper: write the account index for a project
  async function setAccountIndex(project: string, accounts: string[]): Promise<void> {
    await storage.set(accountIndexKey(project), JSON.stringify(accounts));
  }

  // Helper: read and validate a delegation record
  async function getDelegationRecord(
    account: string,
    project?: string,
  ): Promise<DelegationRecord> {
    const data = await storage.get(delegationKey(account));
    if (!data) {
      throw new Error(`Account ${account} is not delegated`);
    }

    const record = JSON.parse(data) as DelegationRecord;

    if (project && record.project !== project) {
      throw new Error(
        `Account ${account} is delegated to project "${record.project}", not "${project}"`,
      );
    }

    return record;
  }

  return {
    async delegate(options: DelegateOptions): Promise<DelegationResult> {
      // Prevent double-delegation
      const existing = await storage.get(delegationKey(options.account));
      if (existing) {
        throw new Error(`Account ${options.account} is already delegated`);
      }

      // Resolve project region to determine target validator
      const region = await resolveProjectRegion(options.project);
      const validatorPubkey = VALIDATORS[network][region];
      const validator = REGIONS[region][network].http;

      const now = new Date();
      const record: DelegationRecord = {
        account: options.account,
        project: options.project,
        validator,
        validatorPubkey,
        delegatedAt: now.toISOString(),
      };

      // Persist delegation record
      await storage.set(delegationKey(options.account), JSON.stringify(record));

      // Update project account index
      const index = await getAccountIndex(options.project);
      if (!index.includes(options.account)) {
        index.push(options.account);
        await setAccountIndex(options.project, index);
      }

      return {
        signature: generateSignature(),
        validator,
        delegatedAt: now,
      };
    },

    async undelegate(options: UndelegateOptions): Promise<DelegationResult> {
      const record = await getDelegationRecord(options.account, options.project);

      // Remove delegation record
      await storage.delete(delegationKey(options.account));

      // Remove from project account index
      const index = await getAccountIndex(options.project);
      const filtered = index.filter((a) => a !== options.account);
      await setAccountIndex(options.project, filtered);

      return {
        signature: generateSignature(),
        validator: record.validator,
        delegatedAt: new Date(record.delegatedAt),
      };
    },

    async commit(options: CommitOptions): Promise<CommitResult> {
      // Validate the account is delegated to this project
      await getDelegationRecord(options.account, options.project);

      return {
        signature: generateSignature(),
        // Approximate Solana slot based on ~400ms slot time
        slot: Math.floor(Date.now() / 400),
      };
    },

    async status(account: string): Promise<DelegationStatus> {
      const data = await storage.get(delegationKey(account));
      if (!data) {
        return { isDelegated: false };
      }

      const record = JSON.parse(data) as DelegationRecord;
      return {
        isDelegated: true,
        validator: record.validator,
        validatorPubkey: record.validatorPubkey,
        delegatedAt: new Date(record.delegatedAt),
      };
    },

    async accounts(project: string): Promise<DelegatedAccount[]> {
      const index = await getAccountIndex(project);
      const result: DelegatedAccount[] = [];

      for (const account of index) {
        const data = await storage.get(delegationKey(account));
        if (data) {
          const record = JSON.parse(data) as DelegationRecord;
          result.push({
            address: record.account,
            validator: record.validator,
            delegatedAt: new Date(record.delegatedAt),
          });
        }
      }

      return result;
    },

    async diff(account: string): Promise<StateDiff> {
      // Validate the account is actually delegated
      await getDelegationRecord(account);

      // Simulated diff: in a real implementation this would compare
      // on-chain base-layer state with ER state via RPC calls to both
      // the Solana validator and the ephemeral validator.
      return {
        account,
        baseLayerData: '<base layer data>',
        erData: '<ephemeral rollup data>',
        isDifferent: true,
      };
    },
  };
}
