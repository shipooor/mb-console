import type { Storage } from './storage.js';
import type {
  Network,
  Project,
  Crank,
  CrankCreateOptions,
  Region,
} from './types.js';
import type { CranksNamespace } from './client.js';
import type { BlockchainConnection } from './connection.js';
import { generateBase58 } from './utils.js';

// ---------------------------------------------------------------------------
// Key helpers
// ---------------------------------------------------------------------------

const CRANK_PREFIX = 'crank:';
const CRANK_INDEX_PREFIX = 'crank-index:';

function crankKey(id: string): string {
  return `${CRANK_PREFIX}${id}`;
}

function crankIndexKey(project: string): string {
  return `${CRANK_INDEX_PREFIX}${project}`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Load a project from storage and validate that the cranks feature is enabled.
 */
async function requireCranksEnabled(storage: Storage, project: string): Promise<Project> {
  const data = await storage.get(`project:${project}`);
  if (!data) {
    throw new Error(`Project "${project}" not found`);
  }
  const parsed = JSON.parse(data) as Project;
  if (!parsed.features.cranks) {
    throw new Error(
      `Feature "cranks" is not enabled for project "${project}". ` +
        `Enable it with: client.projects.configure("${project}", { features: { cranks: true } })`,
    );
  }
  return parsed;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a fully-functional `CranksNamespace` backed by the given Storage.
 *
 * When a `getConnection` callback returns a valid `BlockchainConnection`
 * with a signer, and the `account` option is provided, a real
 * `createCommitInstruction` is sent to the ER validator.
 * Otherwise, crank creation falls back to simulated behavior.
 */
export function createCranksNamespace(
  storage: Storage,
  _network: Network,
  getConnection?: () => BlockchainConnection | undefined,
  resolveProjectRegion?: (project: string) => Promise<Region>,
): CranksNamespace {
  // Helper: read the crank index for a project
  async function getCrankIndex(project: string): Promise<string[]> {
    const data = await storage.get(crankIndexKey(project));
    return data ? (JSON.parse(data) as string[]) : [];
  }

  // Helper: write the crank index for a project
  async function setCrankIndex(project: string, ids: string[]): Promise<void> {
    await storage.set(crankIndexKey(project), JSON.stringify(ids));
  }

  return {
    async create(options: CrankCreateOptions): Promise<Crank> {
      await requireCranksEnabled(storage, options.project);

      if (options.intervalMs <= 0) {
        throw new Error('intervalMs must be greater than 0');
      }

      const id = `crank_${Date.now().toString(36)}_${generateBase58(6)}`;
      let commitSignature: string | undefined;
      let simulated = true;

      // Real blockchain: send initial commit instruction
      const conn = getConnection?.();
      if (options.account && conn?.signer) {
        try {
          const { PublicKey, Transaction } = await import('@solana/web3.js');
          const { createCommitInstruction } = await import(
            '@magicblock-labs/ephemeral-rollups-sdk'
          );

          const accountPk = new PublicKey(options.account);

          const ix = createCommitInstruction(
            conn.signer.publicKey,
            [accountPk],
          );

          // Resolve ER connection for the commit
          const region = resolveProjectRegion
            ? await resolveProjectRegion(options.project)
            : undefined;
          const erConn = region
            ? (conn.erConnections[region] ?? conn.routerConnection)
            : conn.routerConnection;

          const tx = new Transaction().add(ix);
          tx.feePayer = conn.signer.publicKey;

          // Commit is an ER operation (not base chain)
          tx.recentBlockhash = (
            await erConn.getLatestBlockhash()
          ).blockhash;

          const signed = await conn.signer.signTransaction(tx);
          commitSignature = await erConn.sendRawTransaction(
            signed.serialize(),
          );
          simulated = false;
        } catch (err) {
          console.debug(
            `[mb-console] Real crank commit failed, using simulated mode: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }

      const crank: Crank = {
        id,
        intervalMs: options.intervalMs,
        iterations: options.iterations ?? 0,
        executed: 0,
        status: 'running',
        account: options.account,
        commitSignature,
        simulated,
      };

      // Persist crank record
      await storage.set(crankKey(id), JSON.stringify(crank));

      // Update project crank index
      const index = await getCrankIndex(options.project);
      index.push(id);
      await setCrankIndex(options.project, index);

      return crank;
    },

    async list(project: string): Promise<Crank[]> {
      const index = await getCrankIndex(project);
      const cranks: Crank[] = [];

      for (const id of index) {
        const data = await storage.get(crankKey(id));
        if (data) {
          cranks.push(JSON.parse(data) as Crank);
        }
      }

      return cranks;
    },

    async stop(crankId: string): Promise<Crank> {
      const data = await storage.get(crankKey(crankId));
      if (!data) {
        throw new Error(`Crank "${crankId}" not found`);
      }

      const crank = JSON.parse(data) as Crank;

      if (crank.status === 'stopped') {
        throw new Error(`Crank "${crankId}" is already stopped`);
      }

      if (crank.status === 'completed') {
        throw new Error(`Crank "${crankId}" has already completed`);
      }

      crank.status = 'stopped';
      await storage.set(crankKey(crankId), JSON.stringify(crank));

      return crank;
    },
  };
}
