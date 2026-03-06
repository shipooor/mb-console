import type {
  ClientOptions,
  CommitOptions,
  CommitResult,
  ConfigureProjectOptions,
  CostBreakdown,
  Crank,
  CrankCreateOptions,
  CreateProjectOptions,
  DelegateOptions,
  DelegatedAccount,
  DelegationResult,
  DelegationStatus,
  LogEntry,
  Network,
  PriceFeed,
  PriceFeedOptions,
  PrivacyDepositOptions,
  PrivacyTransferOptions,
  PrivacyWithdrawOptions,
  Project,
  ProjectStatus,
  StateDiff,
  UndelegateOptions,
  VrfRequestOptions,
  VrfResult,
} from './types.js';
import { MemoryStorage, type Storage } from './storage.js';
import { createProjectsNamespace } from './projects.js';
import { createErNamespace } from './er.js';
import { createVrfNamespace } from './vrf.js';
import { createPrivacyNamespace } from './privacy.js';
import { createCranksNamespace } from './cranks.js';
import { createOracleNamespace } from './oracle.js';
import { createMonitorNamespace } from './monitor.js';

// ---------------------------------------------------------------------------
// Namespace Interfaces (stubs — implementations in later tasks)
// ---------------------------------------------------------------------------

export interface ProjectsNamespace {
  create(options: CreateProjectOptions): Promise<Project>;
  get(name: string): Promise<Project>;
  list(): Promise<Project[]>;
  configure(name: string, options: ConfigureProjectOptions): Promise<Project>;
  delete(name: string): Promise<void>;
}

export interface ErNamespace {
  delegate(options: DelegateOptions): Promise<DelegationResult>;
  undelegate(options: UndelegateOptions): Promise<DelegationResult>;
  commit(options: CommitOptions): Promise<CommitResult>;
  status(account: string): Promise<DelegationStatus>;
  accounts(project: string): Promise<DelegatedAccount[]>;
  diff(account: string): Promise<StateDiff>;
}

export interface VrfNamespace {
  request(options: VrfRequestOptions): Promise<VrfResult>;
}

export interface PrivacyNamespace {
  deposit(options: PrivacyDepositOptions): Promise<string>;
  transfer(options: PrivacyTransferOptions): Promise<string>;
  withdraw(options: PrivacyWithdrawOptions): Promise<string>;
}

export interface CranksNamespace {
  create(options: CrankCreateOptions): Promise<Crank>;
  list(project: string): Promise<Crank[]>;
  stop(crankId: string): Promise<Crank>;
}

export interface OracleNamespace {
  getPrice(options: PriceFeedOptions): Promise<PriceFeed>;
}

export interface MonitorNamespace {
  status(project: string): Promise<ProjectStatus>;
  costs(project: string, period?: string): Promise<CostBreakdown>;
  logs(project: string, limit?: number): Promise<LogEntry[]>;
}

// ---------------------------------------------------------------------------
// Namespace Overrides
// ---------------------------------------------------------------------------

export interface NamespaceOverrides {
  projects?: ProjectsNamespace;
  er?: ErNamespace;
  vrf?: VrfNamespace;
  privacy?: PrivacyNamespace;
  cranks?: CranksNamespace;
  oracle?: OracleNamespace;
  monitor?: MonitorNamespace;
}

// ---------------------------------------------------------------------------
// ConsoleClient
// ---------------------------------------------------------------------------

export class ConsoleClient {
  readonly network: Network;
  readonly storage: Storage;

  readonly projects: ProjectsNamespace;
  readonly er: ErNamespace;
  readonly vrf: VrfNamespace;
  readonly privacy: PrivacyNamespace;
  readonly cranks: CranksNamespace;
  readonly oracle: OracleNamespace;
  readonly monitor: MonitorNamespace;

  constructor(options: ClientOptions = {}, namespaces: NamespaceOverrides = {}) {
    this.network = options.network ?? 'devnet';
    this.storage = options.storage ?? new MemoryStorage();

    // Wire real implementations with stub fallbacks
    this.projects = namespaces.projects ?? createProjectsNamespace(this.storage);
    this.er = namespaces.er ?? createErNamespace(
      this.storage,
      this.network,
      async (project) => {
        const p = await this.projects.get(project);
        return p.region;
      },
    );
    this.vrf = namespaces.vrf ?? createVrfNamespace(this.storage, this.network);
    this.privacy = namespaces.privacy ?? createPrivacyNamespace(this.storage, this.network);
    this.cranks = namespaces.cranks ?? createCranksNamespace(this.storage, this.network);
    this.oracle = namespaces.oracle ?? createOracleNamespace(this.storage, this.network);
    this.monitor = namespaces.monitor ?? createMonitorNamespace(this.storage, this.network);
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/** Create a new ConsoleClient instance. */
export function createClient(options: ClientOptions = {}, namespaces: NamespaceOverrides = {}): ConsoleClient {
  return new ConsoleClient(options, namespaces);
}

// ---------------------------------------------------------------------------
// Stub Helpers
// ---------------------------------------------------------------------------

/**
 * Create a proxy object whose every property access returns a function
 * that throws a "not implemented" error. This lets consumers discover
 * the namespace shape at compile time while failing loudly at runtime
 * until the real implementation is wired in.
 */
function createStubNamespace<T extends object>(name: string): T {
  return new Proxy<T>({} as T, {
    get(_target, prop) {
      if (typeof prop === 'symbol') return undefined;
      return () => {
        throw new Error(`${name}.${String(prop)}() is not implemented yet`);
      };
    },
  });
}
