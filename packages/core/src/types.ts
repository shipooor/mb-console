// ---------------------------------------------------------------------------
// Region & Network
// ---------------------------------------------------------------------------

export type Region = 'us' | 'eu' | 'asia';
export type Network = 'devnet' | 'mainnet';

// ---------------------------------------------------------------------------
// Feature Flags
// ---------------------------------------------------------------------------

export interface FeatureFlags {
  gasless: boolean;
  privacy: boolean;
  vrf: boolean;
  cranks: boolean;
  oracle: boolean;
}

// ---------------------------------------------------------------------------
// Core Domain Models
// ---------------------------------------------------------------------------

export interface Project {
  name: string;
  region: Region;
  features: FeatureFlags;
  createdAt: Date;
}

export interface DelegationResult {
  signature: string;
  validator: string;
  delegatedAt: Date;
}

export interface DelegationStatus {
  isDelegated: boolean;
  validator?: string;
  validatorPubkey?: string;
  delegatedAt?: Date;
}

export interface CommitResult {
  signature: string;
  slot: number;
}

export interface DelegatedAccount {
  address: string;
  validator: string;
  delegatedAt: Date;
}

export interface StateDiff {
  account: string;
  baseLayerData: string;
  erData: string;
  isDifferent: boolean;
}

// ---------------------------------------------------------------------------
// VRF
// ---------------------------------------------------------------------------

export interface VrfResult {
  requestId: string;
  randomness: Uint8Array;
  proof: string;
  latencyMs: number;
}

// ---------------------------------------------------------------------------
// Cranks
// ---------------------------------------------------------------------------

export interface Crank {
  id: string;
  intervalMs: number;
  iterations: number;
  executed: number;
  status: 'running' | 'completed' | 'stopped';
}

// ---------------------------------------------------------------------------
// Oracle
// ---------------------------------------------------------------------------

export interface PriceFeed {
  feed: string;
  price: number;
  confidence: number;
  timestamp: Date;
  slot: number;
}

// ---------------------------------------------------------------------------
// Monitoring
// ---------------------------------------------------------------------------

export interface ProjectStatus {
  project: string;
  region: string;
  features: FeatureFlags;
  accounts: DelegatedAccount[];
  uptime: number;
  transactionCount: number;
}

export interface CostBreakdown {
  transactions: { count: number; cost: number };
  commits: { count: number; cost: number };
  sessions: { count: number; cost: number };
  total: number;
  period: string;
}

export interface LogEntry {
  timestamp: Date;
  type: string;
  message: string;
  data?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Signer
// ---------------------------------------------------------------------------

/** Abstraction for transaction signing (wallet adapter or keypair). */
export interface Signer {
  publicKey: string;
  signTransaction(tx: Uint8Array): Promise<Uint8Array>;
  signAllTransactions?(txs: Uint8Array[]): Promise<Uint8Array[]>;
}

// ---------------------------------------------------------------------------
// Client Options
// ---------------------------------------------------------------------------

export interface ClientOptions {
  network?: Network;
  keypairPath?: string;
  wallet?: Signer; // Wallet adapter (browser) or keypair wrapper
  storage?: import('./storage.js').Storage;
}

// ---------------------------------------------------------------------------
// Operation Options
// ---------------------------------------------------------------------------

export interface CreateProjectOptions {
  name: string;
  region?: Region;
  features?: Partial<FeatureFlags>;
}

export interface ConfigureProjectOptions {
  features?: Partial<FeatureFlags>;
  region?: Region;
}

export interface DelegateOptions {
  account: string;
  project: string;
}

export interface CommitOptions {
  account: string;
  project: string;
}

export interface UndelegateOptions {
  account: string;
  project: string;
}

export interface PrivacyDepositOptions {
  project: string;
  token: string;
  amount: number;
}

export interface PrivacyTransferOptions {
  project: string;
  token: string;
  amount: number;
  to: string;
}

export interface PrivacyWithdrawOptions {
  project: string;
  token: string;
  amount: number;
}

export interface CrankCreateOptions {
  project: string;
  intervalMs: number;
  iterations?: number;
}

export interface PriceFeedOptions {
  project: string;
  feed: string;
}

export interface VrfRequestOptions {
  project: string;
}
