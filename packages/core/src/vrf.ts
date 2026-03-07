import type { Storage } from './storage.js';
import type { Network, Project, VrfRequestOptions, VrfResult } from './types.js';
import type { VrfNamespace } from './client.js';
import { generateBase58 } from './utils.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Load a project from storage and validate that the VRF feature is enabled.
 */
async function requireVrfEnabled(storage: Storage, project: string): Promise<Project> {
  const data = await storage.get(`project:${project}`);
  if (!data) {
    throw new Error(`Project "${project}" not found`);
  }
  const parsed = JSON.parse(data) as Project;
  if (!parsed.features.vrf) {
    throw new Error(
      `Feature "vrf" is not enabled for project "${project}". ` +
        `Enable it with: client.projects.configure("${project}", { features: { vrf: true } })`,
    );
  }
  return parsed;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a fully-functional `VrfNamespace` backed by the given Storage.
 *
 * The `request()` method validates the project, generates 32 bytes of
 * cryptographic randomness, and returns a simulated VRF result with
 * proof and latency metrics.
 *
 * NOTE: Randomness generation uses `crypto.getRandomValues` which is
 * cryptographically secure, but the proof is simulated for hackathon demo.
 */
export function createVrfNamespace(
  storage: Storage,
  _network: Network,
): VrfNamespace {
  return {
    async request(options: VrfRequestOptions): Promise<VrfResult> {
      await requireVrfEnabled(storage, options.project);

      const start = performance.now();

      // Generate 32 bytes of cryptographic randomness
      const randomness = new Uint8Array(32);
      crypto.getRandomValues(randomness);

      // Simulate realistic VRF latency (80-120ms)
      const targetLatency = 80 + Math.random() * 40;
      const elapsed = performance.now() - start;
      if (elapsed < targetLatency) {
        await new Promise((resolve) => setTimeout(resolve, targetLatency - elapsed));
      }

      const latencyMs = Math.round(performance.now() - start);

      return {
        requestId: `vrf_${Date.now().toString(36)}_${generateBase58(8)}`,
        randomness,
        proof: generateBase58(128),
        latencyMs,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// VRF Utility Functions
// ---------------------------------------------------------------------------

/**
 * Utility functions for working with VRF randomness output.
 *
 * These helpers make it easy to derive usable random values from the
 * raw 32-byte randomness returned by `client.vrf.request()`.
 */
export const vrf = {
  /**
   * Derive a random integer in the range [min, max] (inclusive) from
   * the first 4 bytes of the randomness output.
   */
  randomInRange(randomBytes: Uint8Array, min: number, max: number): number {
    if (min > max) {
      throw new Error(`min (${min}) must be <= max (${max})`);
    }
    // Read first 4 bytes as a big-endian uint32
    const view = new DataView(randomBytes.buffer, randomBytes.byteOffset, randomBytes.byteLength);
    const value = view.getUint32(0);
    return min + (value % (max - min + 1));
  },

  /**
   * Pick a random element from an array using the VRF randomness.
   */
  randomPick<T>(randomBytes: Uint8Array, items: T[]): T {
    if (items.length === 0) {
      throw new Error('Cannot pick from an empty array');
    }
    const index = vrf.randomInRange(randomBytes, 0, items.length - 1);
    return items[index]!;
  },

  /**
   * Split 32 bytes of randomness into `count` equal-sized chunks.
   *
   * Each chunk can be used as independent randomness for different
   * purposes (e.g., multiple dice rolls from a single VRF request).
   *
   * If 32 is not evenly divisible by `count`, the last chunk may
   * include fewer bytes. Minimum chunk size is 1 byte.
   */
  split(randomBytes: Uint8Array, count: number): Uint8Array[] {
    if (count <= 0) {
      throw new Error('count must be greater than 0');
    }
    if (count > randomBytes.length) {
      throw new Error(`Cannot split ${randomBytes.length} bytes into ${count} chunks`);
    }

    const chunkSize = Math.floor(randomBytes.length / count);
    const chunks: Uint8Array[] = [];

    for (let i = 0; i < count; i++) {
      const start = i * chunkSize;
      const end = i === count - 1 ? randomBytes.length : start + chunkSize;
      chunks.push(randomBytes.slice(start, end));
    }

    return chunks;
  },
};
