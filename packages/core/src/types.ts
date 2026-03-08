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
  slot?: number;
  /** True when the result was simulated (no real blockchain transaction). */
  simulated: boolean;
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
  /** True when the result was simulated (no real blockchain transaction). */
  simulated: boolean;
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
  baseLayerLamports?: number;
  erLamports?: number;
  owner?: string;
}

// ---------------------------------------------------------------------------
// VRF
// ---------------------------------------------------------------------------

export interface VrfResult {
  requestId: string;
  randomness: Uint8Array;
  proof: string;
  latencyMs: number;
  /** True when the result was simulated (no real on-chain VRF). */
  simulated: boolean;
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
  /** Account being committed (when using real blockchain). */
  account?: string;
  /** Initial commit transaction signature (when using real blockchain). */
  commitSignature?: string;
  /** True when the result was simulated (no real blockchain transaction). */
  simulated: boolean;
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
  /** True when the price was simulated (no real on-chain read). */
  simulated: boolean;
}

// ---------------------------------------------------------------------------
// Privacy Result
// ---------------------------------------------------------------------------

export interface PrivacyResult {
  signature: string;
  /** True when the result was simulated (no real blockchain transaction). */
  simulated: boolean;
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

export interface EndpointHealth {
  name: string;
  url: string;
  status: 'online' | 'offline';
  latencyMs: number | null;
}

// ---------------------------------------------------------------------------
// Client Options
// ---------------------------------------------------------------------------

export interface ClientOptions {
  network?: Network;
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
  /** Owner program of the delegated account (required for real blockchain ops). */
  ownerProgram?: string;
}

export interface CommitOptions {
  account: string;
  project: string;
}

export interface UndelegateOptions {
  account: string;
  project: string;
  /** Owner program of the delegated account (required for real blockchain ops). */
  ownerProgram?: string;
}

export interface PrivacyDepositOptions {
  project: string;
  token: string;
  amount: number;
  /** SPL mint address (optional, for real blockchain operations). */
  mint?: string;
}

export interface PrivacyTransferOptions {
  project: string;
  token: string;
  amount: number;
  to: string;
  /** SPL mint address (optional, for real blockchain operations). */
  mint?: string;
}

export interface PrivacyWithdrawOptions {
  project: string;
  token: string;
  amount: number;
  /** SPL mint address (optional, for real blockchain operations). */
  mint?: string;
}

export interface CrankCreateOptions {
  project: string;
  intervalMs: number;
  iterations?: number;
  /** Account to commit (required for real blockchain operations). */
  account?: string;
}

export interface PriceFeedOptions {
  project: string;
  feed: string;
}

export interface VrfRequestOptions {
  project: string;
}
