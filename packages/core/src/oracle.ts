import type { Storage } from './storage.js';
import type {
  Network,
  PriceFeed,
  PriceFeedOptions,
  Project,
} from './types.js';
import type { OracleNamespace } from './client.js';
import type { BlockchainConnection } from './connection.js';
import { PROGRAM_IDS } from './config.js';

// ---------------------------------------------------------------------------
// Pyth Lazer Feed IDs (hex-encoded for PDA derivation)
// ---------------------------------------------------------------------------

const PYTH_FEED_IDS: Record<string, string> = {
  'SOL/USD': 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  'BTC/USD': 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  'ETH/USD': 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  'USDC/USD': 'eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
};

// ---------------------------------------------------------------------------
// Simulated Price Data
// ---------------------------------------------------------------------------

/**
 * Simulated price feeds for common trading pairs.
 * Used as fallback when no blockchain connection is available.
 */
const SIMULATED_PRICES: Record<string, { price: number; confidence: number }> = {
  'SOL/USD': { price: 142.85, confidence: 0.12 },
  'BTC/USD': { price: 67420.5, confidence: 15.3 },
  'ETH/USD': { price: 3520.75, confidence: 2.1 },
  'USDC/USD': { price: 1.0001, confidence: 0.0002 },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Load a project from storage and validate that the oracle feature is enabled.
 */
async function requireOracleEnabled(storage: Storage, project: string): Promise<Project> {
  const data = await storage.get(`project:${project}`);
  if (!data) {
    throw new Error(`Project "${project}" not found`);
  }
  const parsed = JSON.parse(data) as Project;
  if (!parsed.features.oracle) {
    throw new Error(
      `Feature "oracle" is not enabled for project "${project}". ` +
        `Enable it with: client.projects.configure("${project}", { features: { oracle: true } })`,
    );
  }
  return parsed;
}

/**
 * Apply slight randomization to a price to simulate realistic market movement.
 * Varies the price by +/- 0.5%.
 */
function jitterPrice(basePrice: number): number {
  const factor = 1 + (Math.random() - 0.5) * 0.01; // +/- 0.5%
  return Math.round(basePrice * factor * 100) / 100;
}

/**
 * Convert a hex string to a Uint8Array.
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Read a signed 64-bit little-endian integer from a buffer at the given offset.
 */
function readInt64LE(data: Uint8Array, offset: number): bigint {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return view.getBigInt64(offset, true);
}

/**
 * Read an unsigned 64-bit little-endian integer from a buffer at the given offset.
 */
function readUint64LE(data: Uint8Array, offset: number): bigint {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return view.getBigUint64(offset, true);
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a fully-functional `OracleNamespace` backed by the given Storage.
 *
 * When a `getConnection` callback returns a valid `BlockchainConnection`,
 * attempts to read real Pyth Lazer price data from on-chain PDAs.
 * Falls back to simulated prices on any error or missing connection.
 */
export function createOracleNamespace(
  storage: Storage,
  _network: Network,
  getConnection?: () => BlockchainConnection | undefined,
): OracleNamespace {
  return {
    async getPrice(options: PriceFeedOptions): Promise<PriceFeed> {
      await requireOracleEnabled(storage, options.project);

      const feedData = SIMULATED_PRICES[options.feed];
      if (!feedData) {
        const supported = Object.keys(SIMULATED_PRICES).join(', ');
        throw new Error(
          `Unknown price feed: ${options.feed}. Supported feeds: ${supported}`,
        );
      }

      // Attempt real on-chain Pyth Lazer PDA read
      const conn = getConnection?.();
      const feedIdHex = PYTH_FEED_IDS[options.feed];

      if (conn && feedIdHex) {
        try {
          const { PublicKey } = await import('@solana/web3.js');
          const pythProgramId = new PublicKey(PROGRAM_IDS.pythOracle);
          const feedIdBytes = hexToBytes(feedIdHex);

          const [pda] = PublicKey.findProgramAddressSync(
            [
              Buffer.from('price_feed'),
              Buffer.from('pyth-lazer'),
              feedIdBytes,
            ],
            pythProgramId,
          );

          const resp = await conn.baseConnection.getAccountInfoAndContext(pda);
          const accountInfo = resp?.value;
          const contextSlot = resp?.context?.slot;

          if (accountInfo?.data) {
            const data = new Uint8Array(accountInfo.data);

            // Parse Pyth Lazer price feed account layout:
            // Offset 73: price (i64, 8 bytes, little-endian)
            // Offset 81: confidence (u64, 8 bytes, little-endian)
            // Offset 89: timestamp (i64, 8 bytes, little-endian)
            if (data.length >= 97) {
              const rawPrice = readInt64LE(data, 73);
              const rawConfidence = readUint64LE(data, 81);
              const rawTimestamp = readInt64LE(data, 89);

              // Pyth prices have an exponent — normalize to human-readable
              // Standard Pyth exponent is -8 (8 decimal places)
              const price = Number(rawPrice) / 1e8;
              const confidence = Number(rawConfidence) / 1e8;
              const timestamp = new Date(Number(rawTimestamp) * 1000);

              return {
                feed: options.feed,
                price,
                confidence,
                timestamp,
                slot: contextSlot ?? Math.floor(Date.now() / 400),
                simulated: false,
              };
            }
          }
        } catch (err) {
          console.warn(
            `[mb-console] Real Pyth price read failed, using simulated mode: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }

      // Simulated fallback
      return {
        feed: options.feed,
        price: jitterPrice(feedData.price),
        confidence: feedData.confidence,
        timestamp: new Date(),
        slot: Math.floor(Date.now() / 400),
        simulated: true,
      };
    },
  };
}
