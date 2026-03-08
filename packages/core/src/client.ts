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
  PrivacyResult,
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
import type { BlockchainConnection } from './connection.js';

// ---------------------------------------------------------------------------
// Namespace Interfaces
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
  deposit(options: PrivacyDepositOptions): Promise<PrivacyResult>;
  transfer(options: PrivacyTransferOptions): Promise<PrivacyResult>;
  withdraw(options: PrivacyWithdrawOptions): Promise<PrivacyResult>;
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

  private _connection?: BlockchainConnection;

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
      () => this._connection,
    );
    this.vrf = namespaces.vrf ?? createVrfNamespace(this.storage, this.network);
    this.privacy = namespaces.privacy ?? createPrivacyNamespace(
      this.storage, this.network, () => this._connection,
    );
    this.cranks = namespaces.cranks ?? createCranksNamespace(
      this.storage, this.network, () => this._connection,
    );
    this.oracle = namespaces.oracle ?? createOracleNamespace(
      this.storage, this.network, () => this._connection,
    );
    this.monitor = namespaces.monitor ?? createMonitorNamespace(this.storage, this.network);
  }

  /**
   * Connect to Solana using a local keypair file.
   * Enables real on-chain transactions for ER operations.
   * Typically used by CLI and MCP server.
   *
   * Connection module is loaded dynamically to avoid pulling Node.js-only
   * dependencies (@solana/web3.js, MagicBlock SDK) into browser bundles.
   */
  async connectWithKeypair(keypairPath: string): Promise<void> {
    const { createKeypairSigner, createBlockchainConnection } = await import('./connection.js');
    const signer = await createKeypairSigner(keypairPath);
    this._connection = createBlockchainConnection(this.network, signer);
  }

  /**
   * Connect in read-only mode (no signer).
   * Enables querying real on-chain data (status, diff) without
   * the ability to send transactions.
   *
   * Note: requires Node.js environment (uses @solana/web3.js Connection).
   */
  async connectReadOnly(): Promise<void> {
    const { createReadOnlyConnection } = await import('./connection.js');
    this._connection = createReadOnlyConnection(this.network);
  }

  /** Returns true if a blockchain connection is active. */
  get isConnected(): boolean {
    return this._connection !== undefined;
  }

  /** Returns true if the connection has a signer (can send transactions). */
  get canSign(): boolean {
    return this._connection?.signer !== undefined;
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/** Create a new ConsoleClient instance. */
export function createClient(options: ClientOptions = {}, namespaces: NamespaceOverrides = {}): ConsoleClient {
  return new ConsoleClient(options, namespaces);
}
