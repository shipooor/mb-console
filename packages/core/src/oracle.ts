import type { Storage } from './storage.js';
import type {
  Network,
  PriceFeed,
  PriceFeedOptions,
  Project,
} from './types.js';
import type { OracleNamespace } from './client.js';
import type { BlockchainConnection } from './connection.js';

// ---------------------------------------------------------------------------
// Pyth Feed IDs (hex-encoded, 32 bytes)
// ---------------------------------------------------------------------------

const PYTH_FEED_IDS: Record<string, string> = {
  'SOL/USD': 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  'BTC/USD': 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  'ETH/USD': 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  'USDC/USD': 'eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
};

/**
 * Pyth Solana Receiver program — owns PriceUpdateV2 accounts on devnet/mainnet.
 */
const PYTH_RECEIVER_PROGRAM = 'rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ';

/**
 * PriceUpdateV2 account layout:
 *   [0..8)    Anchor discriminator
 *   [8..40)   write_authority (Pubkey)
 *   [40]      verification_level (u8)
 *   [41..73)  feed_id (32 bytes)
 *   [73..81)  price (i64 LE)
 *   [81..89)  confidence (u64 LE)
 *   [89..93)  exponent (i32 LE)
 *   [93..101) publish_time (i64 LE)
 *   [101..109) prev_publish_time (i64 LE)
 *   [109..117) ema_price (i64 LE)
 *   [117..125) ema_conf (u64 LE)
 *   [125..133) posted_slot (u64 LE)
 *   Total: 134 bytes (with 1 byte padding)
 */
const PRICE_UPDATE_SIZE = 134;
const FEED_ID_OFFSET = 41;

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

/**
 * Read a signed 32-bit little-endian integer from a buffer at the given offset.
 */
function readInt32LE(data: Uint8Array, offset: number): number {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return view.getInt32(offset, true);
}

/**
 * Encode a Uint8Array to base64 string (works in both Node.js and browser).
 */
function bytesToBase64(bytes: Uint8Array): string {
  // Use Buffer in Node.js, btoa in browser
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
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

      // Attempt real on-chain Pyth price read via Pyth Solana Receiver
      const conn = getConnection?.();
      const feedIdHex = PYTH_FEED_IDS[options.feed];

      if (conn && feedIdHex) {
        try {
          const { PublicKey } = await import('@solana/web3.js');
          const receiverProgramId = new PublicKey(PYTH_RECEIVER_PROGRAM);
          const feedIdBytes = hexToBytes(feedIdHex);

          // Find a PriceUpdateV2 account matching this feed ID via memcmp filter
          const accounts = await conn.baseConnection.getProgramAccounts(
            receiverProgramId,
            {
              filters: [
                { dataSize: PRICE_UPDATE_SIZE },
                { memcmp: { offset: FEED_ID_OFFSET, bytes: bytesToBase64(feedIdBytes) , encoding: 'base64' } },
              ],
              dataSlice: { offset: 73, length: 28 },
            },
          );

          if (accounts.length > 0) {
            // Pick the account with the most recent publish_time
            let bestIdx = 0;
            if (accounts.length > 1) {
              let bestTime = readInt64LE(new Uint8Array(accounts[0].account.data), 20);
              for (let i = 1; i < accounts.length; i++) {
                const t = readInt64LE(new Uint8Array(accounts[i].account.data), 20);
                if (t > bestTime) {
                  bestTime = t;
                  bestIdx = i;
                }
              }
            }

            const sliceData = new Uint8Array(accounts[bestIdx].account.data);

            // Slice layout (relative to offset 73):
            //   [0..8)   price (i64 LE)
            //   [8..16)  confidence (u64 LE)
            //   [16..20) exponent (i32 LE)
            //   [20..28) publish_time (i64 LE)
            const rawPrice = readInt64LE(sliceData, 0);
            const rawConfidence = readUint64LE(sliceData, 8);
            const rawExponent = readInt32LE(sliceData, 16);
            const rawTimestamp = readInt64LE(sliceData, 20);

            // Check staleness — reject data older than 120 seconds
            const ageSeconds = Math.floor(Date.now() / 1000) - Number(rawTimestamp);
            if (ageSeconds > 120) {
              console.warn(
                `[mb-console] Pyth price data for ${options.feed} is ${ageSeconds}s old, using simulated mode`,
              );
            } else {
              // Pyth exponents are typically negative (e.g. -8).
              // Use multiplication with 10^exponent which works for any sign.
              const scale = Math.pow(10, rawExponent);
              const price = Number(rawPrice) * scale;
              const confidence = Number(rawConfidence) * scale;
              const timestamp = new Date(Number(rawTimestamp) * 1000);

              return {
                feed: options.feed,
                price,
                confidence,
                timestamp,
                // getProgramAccounts doesn't expose context.slot;
                // approximate from wall clock (~400ms per slot)
                slot: Math.floor(Date.now() / 400),
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
