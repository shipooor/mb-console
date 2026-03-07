import type { Storage } from './storage.js';
import type {
  Network,
  Project,
  Crank,
  CrankCreateOptions,
} from './types.js';
import type { CranksNamespace } from './client.js';
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
 * Crank records are persisted under `crank:<id>` keys.
 * A per-project crank index is maintained under `crank-index:<project>`.
 *
 * NOTE: Crank execution is simulated for hackathon demo purposes.
 * In a real implementation, the crank service would run on the
 * MagicBlock infrastructure and periodically invoke program instructions.
 */
export function createCranksNamespace(
  storage: Storage,
  _network: Network,
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

      const crank: Crank = {
        id,
        intervalMs: options.intervalMs,
        iterations: options.iterations ?? 0,
        executed: 0,
        status: 'running',
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
