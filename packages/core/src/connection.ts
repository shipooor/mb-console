import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import { ConnectionMagicRouter } from '@magicblock-labs/ephemeral-rollups-sdk';
import type { Network } from './types.js';
import { MAGIC_ROUTER, REGIONS } from './config.js';

// ---------------------------------------------------------------------------
// Signer Adapter
// ---------------------------------------------------------------------------

/**
 * Adapter bridging a Solana Keypair (or wallet adapter) into a uniform
 * signing interface used by the Console SDK.
 */
export interface SolanaSignerAdapter {
  publicKey: PublicKey;
  signTransaction(tx: Transaction): Promise<Transaction>;
}

// ---------------------------------------------------------------------------
// Blockchain Connection
// ---------------------------------------------------------------------------

/**
 * Holds all the connections needed to interact with the Solana base layer,
 * the Magic Router, and regional ER validators.
 */
export interface BlockchainConnection {
  /** Standard Solana RPC connection (devnet / mainnet). */
  baseConnection: Connection;
  /** Magic Router connection for delegation routing. */
  routerConnection: ConnectionMagicRouter;
  /** Regional ER endpoint connections keyed by region id. */
  erConnections: Record<string, Connection>;
  /** Signer for building and sending transactions (undefined = read-only). */
  signer?: SolanaSignerAdapter;
  /** Active network. */
  network: Network;
}

// ---------------------------------------------------------------------------
// Keypair Signer
// ---------------------------------------------------------------------------

/**
 * Create a `SolanaSignerAdapter` from a local keypair JSON file.
 * The file should contain a JSON array of 64 bytes (Solana CLI format).
 */
export async function createKeypairSigner(
  keypairPath: string,
): Promise<SolanaSignerAdapter> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const resolved = path.resolve(keypairPath);
  if (!resolved.endsWith('.json')) {
    throw new Error('Keypair file must be a .json file');
  }

  const raw = await fs.readFile(resolved, 'utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Invalid keypair file: must contain valid JSON');
  }

  if (
    !Array.isArray(parsed) ||
    parsed.length !== 64 ||
    !parsed.every((n) => typeof n === 'number' && n >= 0 && n <= 255)
  ) {
    throw new Error('Invalid keypair file: must contain a JSON array of 64 bytes');
  }

  const secretKey = Uint8Array.from(parsed);
  const keypair = Keypair.fromSecretKey(secretKey);
  // Zero out intermediate buffer
  secretKey.fill(0);

  return {
    publicKey: keypair.publicKey,
    async signTransaction(tx: Transaction): Promise<Transaction> {
      tx.partialSign(keypair);
      return tx;
    },
  };
}

// ---------------------------------------------------------------------------
// Connection Factories
// ---------------------------------------------------------------------------

const SOLANA_RPC: Record<Network, string> = {
  devnet: 'https://api.devnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com',
};

/**
 * Create a full `BlockchainConnection` with signer for sending transactions.
 */
export function createBlockchainConnection(
  network: Network,
  signer: SolanaSignerAdapter,
): BlockchainConnection {
  return buildConnection(network, signer);
}

/**
 * Create a read-only `BlockchainConnection` (no signer).
 * Useful for querying delegation status and account data without signing.
 */
export function createReadOnlyConnection(
  network: Network,
): BlockchainConnection {
  return buildConnection(network);
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function buildConnection(
  network: Network,
  signer?: SolanaSignerAdapter,
): BlockchainConnection {
  const baseConnection = new Connection(SOLANA_RPC[network], 'confirmed');

  const routerUrl = MAGIC_ROUTER[network].http;
  const routerConnection = new ConnectionMagicRouter(routerUrl, 'confirmed');

  const erConnections: Record<string, Connection> = {};
  for (const [region, config] of Object.entries(REGIONS)) {
    erConnections[region] = new Connection(config[network].http, 'confirmed');
  }

  return {
    baseConnection,
    routerConnection,
    erConnections,
    signer,
    network,
  };
}
