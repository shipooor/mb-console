import type { Storage } from './storage.js';
import type {
  CostBreakdown,
  DelegatedAccount,
  LogEntry,
  Network,
  Project,
  ProjectStatus,
} from './types.js';
import type { MonitorNamespace } from './client.js';

// ---------------------------------------------------------------------------
// Key helpers
// ---------------------------------------------------------------------------

const PROJECT_PREFIX = 'project:';
const ACCOUNT_INDEX_PREFIX = 'account-index:';
const DELEGATION_PREFIX = 'delegation:';
const LOGS_PREFIX = 'logs:';
const MAX_LOG_ENTRIES = 1000;
const DEFAULT_LOG_LIMIT = 50;

function projectKey(name: string): string {
  return `${PROJECT_PREFIX}${name}`;
}

function accountIndexKey(project: string): string {
  return `${ACCOUNT_INDEX_PREFIX}${project}`;
}

function delegationKey(account: string): string {
  return `${DELEGATION_PREFIX}${account}`;
}

function logsKey(project: string): string {
  return `${LOGS_PREFIX}${project}`;
}

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

/** Serializable delegation record (mirrors the shape from er.ts). */
interface DelegationRecord {
  account: string;
  project: string;
  validator: string;
  delegatedAt: string; // ISO string
}

/** Serializable log entry stored in Storage. */
interface SerializedLogEntry {
  timestamp: string; // ISO string
  type: string;
  message: string;
  data?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Serialization helpers
// ---------------------------------------------------------------------------

function deserializeProject(json: string): Project {
  const raw = JSON.parse(json);
  return { ...raw, createdAt: new Date(raw.createdAt) };
}

function deserializeLogEntry(raw: SerializedLogEntry): LogEntry {
  return {
    timestamp: new Date(raw.timestamp),
    type: raw.type,
    message: raw.message,
    ...(raw.data !== undefined ? { data: raw.data } : {}),
  };
}

// ---------------------------------------------------------------------------
// Log append utility
// ---------------------------------------------------------------------------

/**
 * Append a log entry for a project.
 *
 * Keeps at most {@link MAX_LOG_ENTRIES} entries (oldest are pruned).
 * This utility is exported so other namespaces can record events.
 */
export async function appendLog(
  storage: Storage,
  project: string,
  entry: Omit<LogEntry, 'timestamp'>,
): Promise<void> {
  const key = logsKey(project);
  const data = await storage.get(key);
  const logs: SerializedLogEntry[] = data
    ? (JSON.parse(data) as SerializedLogEntry[])
    : [];

  logs.push({
    timestamp: new Date().toISOString(),
    type: entry.type,
    message: entry.message,
    ...(entry.data !== undefined ? { data: entry.data } : {}),
  });

  // Prune oldest entries when exceeding the cap
  if (logs.length > MAX_LOG_ENTRIES) {
    logs.splice(0, logs.length - MAX_LOG_ENTRIES);
  }

  await storage.set(key, JSON.stringify(logs));
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a fully-functional `MonitorNamespace` backed by the given Storage.
 *
 * The monitor aggregates data that other namespaces (projects, er) have
 * persisted: project records, delegation indexes, and log entries.
 *
 * NOTE: Cost calculations and uptime are simulated for hackathon purposes.
 * The structure is ready for real telemetry data to be plugged in.
 */
export function createMonitorNamespace(
  storage: Storage,
  _network: Network,
): MonitorNamespace {
  // -----------------------------------------------------------------------
  // Shared helpers
  // -----------------------------------------------------------------------

  /** Read and validate that a project exists, returning its data. */
  async function getProject(name: string): Promise<Project> {
    const data = await storage.get(projectKey(name));
    if (!data) {
      throw new Error(`Project "${name}" not found`);
    }
    return deserializeProject(data);
  }

  /** Read the account index for a project (may be empty). */
  async function getAccountIndex(project: string): Promise<string[]> {
    const data = await storage.get(accountIndexKey(project));
    return data ? (JSON.parse(data) as string[]) : [];
  }

  /** Resolve delegation records for all indexed accounts. */
  async function getDelegatedAccounts(
    project: string,
  ): Promise<DelegatedAccount[]> {
    const index = await getAccountIndex(project);
    const accounts: DelegatedAccount[] = [];

    for (const account of index) {
      const data = await storage.get(delegationKey(account));
      if (data) {
        const record = JSON.parse(data) as DelegationRecord;
        accounts.push({
          address: record.account,
          validator: record.validator,
          delegatedAt: new Date(record.delegatedAt),
        });
      }
    }

    return accounts;
  }

  /** Read all log entries for a project (already serialized). */
  async function readLogs(project: string): Promise<SerializedLogEntry[]> {
    const data = await storage.get(logsKey(project));
    return data ? (JSON.parse(data) as SerializedLogEntry[]) : [];
  }

  // -----------------------------------------------------------------------
  // Namespace methods
  // -----------------------------------------------------------------------

  return {
    async status(project: string): Promise<ProjectStatus> {
      const projectData = await getProject(project);
      const accounts = await getDelegatedAccounts(project);
      const logs = await readLogs(project);

      // Count transaction-type log entries for the transaction counter
      const transactionCount = logs.filter(
        (l) => l.type === 'transaction' || l.type === 'delegation' || l.type === 'commit',
      ).length || logs.length;

      return {
        project: projectData.name,
        region: projectData.region,
        features: projectData.features,
        accounts,
        uptime: 99.9, // simulated
        transactionCount,
      };
    },

    async costs(project: string, period?: string): Promise<CostBreakdown> {
      // Validate project exists
      await getProject(project);

      const accounts = await getDelegatedAccounts(project);
      const logs = await readLogs(project);

      // Count logged events by type for cost calculation
      const txCount =
        logs.filter((l) => l.type === 'transaction').length ||
        accounts.length * 12;
      const commitCount =
        logs.filter((l) => l.type === 'commit').length ||
        accounts.length * 3;
      const sessionCount =
        logs.filter((l) => l.type === 'session').length ||
        Math.max(accounts.length, 1);

      const txCost = txCount * 0.000005;
      const commitCost = commitCount * 0.0001;
      const sessionCost = sessionCount * 0.0003;

      return {
        transactions: { count: txCount, cost: txCost },
        commits: { count: commitCount, cost: commitCost },
        sessions: { count: sessionCount, cost: sessionCost },
        total: txCost + commitCost + sessionCost,
        period: period ?? '30d',
      };
    },

    async logs(project: string, limit?: number): Promise<LogEntry[]> {
      // Validate project exists
      await getProject(project);

      const logs = await readLogs(project);
      const effectiveLimit = limit ?? DEFAULT_LOG_LIMIT;

      // Return last N entries, newest first
      return logs
        .slice(-effectiveLimit)
        .reverse()
        .map(deserializeLogEntry);
    },
  };
}
