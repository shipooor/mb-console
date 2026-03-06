import type { Storage } from './storage.js';
import type {
  Network,
  PriceFeed,
  PriceFeedOptions,
  Project,
} from './types.js';
import type { OracleNamespace } from './client.js';

// ---------------------------------------------------------------------------
// Simulated Price Data
// ---------------------------------------------------------------------------

/**
 * Simulated price feeds for common trading pairs.
 *
 * NOTE: These are static reference prices for hackathon demo purposes.
 * A real implementation would fetch live data from on-chain Pyth oracles
 * or the MagicBlock oracle aggregation layer.
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

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a fully-functional `OracleNamespace` backed by the given Storage.
 *
 * The `getPrice()` method validates the project, checks for the oracle
 * feature flag, and returns simulated price data with slight randomization
 * for supported feeds (SOL/USD, BTC/USD, ETH/USD, USDC/USD).
 *
 * NOTE: Price data is simulated for hackathon demo purposes. A real
 * implementation would query on-chain Pyth price feeds via the
 * MagicBlock oracle aggregation layer.
 */
export function createOracleNamespace(
  storage: Storage,
  _network: Network,
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

      return {
        feed: options.feed,
        price: jitterPrice(feedData.price),
        confidence: feedData.confidence,
        timestamp: new Date(),
        // Approximate Solana slot based on ~400ms slot time
        slot: Math.floor(Date.now() / 400),
      };
    },
  };
}
