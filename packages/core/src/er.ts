import { PublicKey, Transaction } from '@solana/web3.js';
import {
  createDelegateInstruction,
  createCommitInstruction,
  createCommitAndUndelegateInstruction,
} from '@magicblock-labs/ephemeral-rollups-sdk';
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
import type { BlockchainConnection } from './connection.js';
import { VALIDATORS, REGIONS, PROGRAM_IDS } from './config.js';
import { generateSignature } from './utils.js';

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
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a fully-functional `ErNamespace` backed by the given Storage.
 *
 * When a `getConnection` callback is provided and returns a valid
 * `BlockchainConnection`, real on-chain transactions are built and sent
 * via the MagicBlock SDK. Otherwise, operations fall back to simulated
 * behavior with locally-generated signatures.
 *
 * Storage metadata is maintained in both modes so that monitor/accounts
 * remain consistent regardless of connection state.
 */
export function createErNamespace(
  storage: Storage,
  network: Network,
  resolveProjectRegion: (project: string) => Promise<Region>,
  getConnection?: () => BlockchainConnection | undefined,
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

  // Helper: persist delegation metadata in storage
  async function persistDelegation(
    account: string,
    project: string,
    validator: string,
    validatorPubkey: string,
    now: Date,
  ): Promise<void> {
    const record: DelegationRecord = {
      account,
      project,
      validator,
      validatorPubkey,
      delegatedAt: now.toISOString(),
    };
    await storage.set(delegationKey(account), JSON.stringify(record));

    const index = await getAccountIndex(project);
    if (!index.includes(account)) {
      index.push(account);
      await setAccountIndex(project, index);
    }
  }

  // Helper: remove delegation metadata from storage
  async function removeDelegation(account: string, project: string): Promise<void> {
    await storage.delete(delegationKey(account));

    const index = await getAccountIndex(project);
    const filtered = index.filter((a) => a !== account);
    await setAccountIndex(project, filtered);
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

      const conn = getConnection?.();

      // When a signer is available, ownerProgram is required for real delegation
      if (conn?.signer && !options.ownerProgram) {
        throw new Error(
          'ownerProgram is required for real blockchain delegation. ' +
          'Pass --owner-program <pubkey> or set ownerProgram in options.',
        );
      }

      // Real blockchain path
      if (conn?.signer && options.ownerProgram) {
        try {
          const accountPk = new PublicKey(options.account);
          const ownerProgramPk = new PublicKey(options.ownerProgram);
          const validatorPk = new PublicKey(validatorPubkey);

          const ix = createDelegateInstruction(
            {
              payer: conn.signer.publicKey,
              delegatedAccount: accountPk,
              ownerProgram: ownerProgramPk,
              validator: validatorPk,
            },
            { commitFrequencyMs: 30_000, validator: validatorPk },
          );

          const tx = new Transaction().add(ix);
          tx.feePayer = conn.signer.publicKey;
          tx.recentBlockhash = (
            await conn.routerConnection.getLatestBlockhash()
          ).blockhash;

          const signed = await conn.signer.signTransaction(tx);
          const signature = await conn.routerConnection.sendRawTransaction(
            signed.serialize(),
          );

          const now = new Date();
          await persistDelegation(
            options.account,
            options.project,
            validator,
            validatorPubkey,
            now,
          );

          return { signature, validator, delegatedAt: now, simulated: false };
        } catch (err) {
          // Fall through to simulated on network error
          console.warn(
            `[mb-console] Real delegation failed, using simulated mode: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }

      // Simulated fallback
      const now = new Date();
      await persistDelegation(
        options.account,
        options.project,
        validator,
        validatorPubkey,
        now,
      );

      return {
        signature: generateSignature(),
        validator,
        delegatedAt: now,
        simulated: true,
      };
    },

    async undelegate(options: UndelegateOptions): Promise<DelegationResult> {
      const record = await getDelegationRecord(options.account, options.project);
      const conn = getConnection?.();

      // Real blockchain: commit + undelegate
      if (conn?.signer) {
        try {
          const accountPk = new PublicKey(options.account);

          // Determine which ER connection to use for the commit+undelegate
          const region = await resolveProjectRegion(options.project);
          const erConn = conn.erConnections[region] ?? conn.routerConnection;

          const ix = createCommitAndUndelegateInstruction(
            conn.signer.publicKey,
            [accountPk],
          );

          const tx = new Transaction().add(ix);
          tx.feePayer = conn.signer.publicKey;
          tx.recentBlockhash = (
            await erConn.getLatestBlockhash()
          ).blockhash;

          const signed = await conn.signer.signTransaction(tx);
          const signature = await erConn.sendRawTransaction(signed.serialize());

          await removeDelegation(options.account, options.project);

          return {
            signature,
            validator: record.validator,
            delegatedAt: new Date(record.delegatedAt),
            simulated: false,
          };
        } catch (err) {
          console.warn(
            `[mb-console] Real undelegation failed, using simulated mode: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }

      // Simulated fallback
      await removeDelegation(options.account, options.project);

      return {
        signature: generateSignature(),
        validator: record.validator,
        delegatedAt: new Date(record.delegatedAt),
        simulated: true,
      };
    },

    async commit(options: CommitOptions): Promise<CommitResult> {
      // Validate the account is delegated to this project
      await getDelegationRecord(options.account, options.project);

      const conn = getConnection?.();

      // Real blockchain: schedule commit on the ER
      if (conn?.signer) {
        try {
          const accountPk = new PublicKey(options.account);
          const region = await resolveProjectRegion(options.project);
          const erConn = conn.erConnections[region] ?? conn.routerConnection;

          const ix = createCommitInstruction(
            conn.signer.publicKey,
            [accountPk],
          );

          const tx = new Transaction().add(ix);
          tx.feePayer = conn.signer.publicKey;
          tx.recentBlockhash = (
            await erConn.getLatestBlockhash()
          ).blockhash;

          const signed = await conn.signer.signTransaction(tx);
          const signature = await erConn.sendRawTransaction(signed.serialize());

          const slot = (await erConn.getSlot()) ?? Math.floor(Date.now() / 400);

          return { signature, slot, simulated: false };
        } catch (err) {
          console.warn(
            `[mb-console] Real commit failed, using simulated mode: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }

      // Simulated fallback
      return {
        signature: generateSignature(),
        slot: Math.floor(Date.now() / 400),
        simulated: true,
      };
    },

    async status(account: string): Promise<DelegationStatus> {
      const conn = getConnection?.();

      // Real blockchain: check if the account is owned by the Delegation Program
      if (conn) {
        try {
          const accountPk = new PublicKey(account);
          const accountInfo = await conn.baseConnection.getAccountInfo(accountPk);

          if (accountInfo) {
            const delegationProgramId = new PublicKey(PROGRAM_IDS.delegation);
            if (accountInfo.owner.equals(delegationProgramId)) {
              // Account is delegated — enrich with local storage data
              const data = await storage.get(delegationKey(account));
              if (data) {
                const record = JSON.parse(data) as DelegationRecord;
                return {
                  isDelegated: true,
                  validator: record.validator,
                  validatorPubkey: record.validatorPubkey,
                  delegatedAt: new Date(record.delegatedAt),
                };
              }
              return { isDelegated: true };
            }
          }

          return { isDelegated: false };
        } catch (err) {
          console.warn(
            `[mb-console] Real status check failed, using local storage: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }

      // Simulated fallback: check local storage
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
      const conn = getConnection?.();

      // Real blockchain: compare base layer vs ER account data
      if (conn) {
        try {
          // Check local storage for delegation record to know which ER to query
          const data = await storage.get(delegationKey(account));
          const accountPk = new PublicKey(account);

          const baseInfo = await conn.baseConnection.getAccountInfo(accountPk);
          const baseData = baseInfo?.data
            ? Buffer.from(baseInfo.data).toString('base64')
            : '<not found>';

          let erData = '<not delegated>';
          let erLamports: number | undefined;

          if (data) {
            const record = JSON.parse(data) as DelegationRecord;
            // Find the matching ER connection
            const regionKey = Object.entries(REGIONS).find(
              ([, config]) => config[network].http === record.validator,
            )?.[0];
            const erConn = regionKey
              ? conn.erConnections[regionKey]
              : conn.routerConnection;

            const erInfo = await erConn.getAccountInfo(accountPk);
            erData = erInfo?.data
              ? Buffer.from(erInfo.data).toString('base64')
              : '<not found on ER>';
            erLamports = erInfo?.lamports;
          }

          return {
            account,
            baseLayerData: baseData,
            erData,
            isDifferent: baseData !== erData,
            baseLayerLamports: baseInfo?.lamports,
            erLamports,
            owner: baseInfo?.owner?.toBase58(),
          };
        } catch (err) {
          console.warn(
            `[mb-console] Real diff failed, using simulated mode: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }

      // Simulated fallback: validate delegation exists in local storage
      await getDelegationRecord(account);

      return {
        account,
        baseLayerData: '<base layer data>',
        erData: '<ephemeral rollup data>',
        isDifferent: true,
      };
    },
  };
}
