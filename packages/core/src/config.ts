import type { FeatureFlags, Network, Region } from './types.js';

// ---------------------------------------------------------------------------
// Region Endpoints
// ---------------------------------------------------------------------------

export interface RegionEndpoints {
  http: string;
  ws: string;
}

export interface RegionConfig {
  devnet: RegionEndpoints;
  mainnet: RegionEndpoints;
}

export const REGIONS: Record<Region, RegionConfig> = {
  us: {
    devnet: {
      http: 'https://devnet-us.magicblock.app',
      ws: 'wss://devnet-us.magicblock.app',
    },
    mainnet: {
      http: 'https://us.magicblock.app',
      ws: 'wss://us.magicblock.app',
    },
  },
  eu: {
    devnet: {
      http: 'https://devnet-eu.magicblock.app',
      ws: 'wss://devnet-eu.magicblock.app',
    },
    mainnet: {
      http: 'https://eu.magicblock.app',
      ws: 'wss://eu.magicblock.app',
    },
  },
  asia: {
    devnet: {
      http: 'https://devnet-as.magicblock.app',
      ws: 'wss://devnet-as.magicblock.app',
    },
    mainnet: {
      http: 'https://as.magicblock.app',
      ws: 'wss://as.magicblock.app',
    },
  },
};

// ---------------------------------------------------------------------------
// Program IDs
// ---------------------------------------------------------------------------

export const PROGRAM_IDS = {
  delegation: 'DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh',
  magic: 'Magic11111111111111111111111111111111111111',
  magicContext: 'MagicContext1111111111111111111111111111111',
  permission: 'ACLseoPoyC3cBqoUtkbjZ4aDrkurZW86v19pXz2XQnp1',
  ephemeralSplToken: 'SPLxh1LVZzEkX99H6rqYizhytLWPZVV296zyYDPagv2',
  pythOracle: 'PriCems5tHihc6UDXDjzjeawomAwBduWMGAi8ZUjppd',
} as const;

// ---------------------------------------------------------------------------
// Validator Pubkeys
// ---------------------------------------------------------------------------

export interface ValidatorSet {
  us: string;
  eu: string;
  asia: string;
  tee: string;
}

export const VALIDATORS: Record<Network, ValidatorSet> = {
  devnet: {
    us: 'MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd',
    eu: 'MEUGGrYPxKk17hCr7wpT6s8dtNokZj5U2L57vjYMS8e',
    asia: 'MAS1Dt9qreoRMQ14YQuhg8UTZMMzDdKhmkZMECCzk57',
    tee: 'MTEWGuqxUpYZGFJQcp8tLN7x5v9BSeoFHYWQQ3n3xzo',
  },
  mainnet: {
    us: 'MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd',
    eu: 'MEUGGrYPxKk17hCr7wpT6s8dtNokZj5U2L57vjYMS8e',
    asia: 'MAS1Dt9qreoRMQ14YQuhg8UTZMMzDdKhmkZMECCzk57',
    tee: 'MTEWGuqxUpYZGFJQcp8tLN7x5v9BSeoFHYWQQ3n3xzo',
  },
};

// ---------------------------------------------------------------------------
// Magic Router
// ---------------------------------------------------------------------------

export interface RouterEndpoints {
  http: string;
  ws: string;
}

export const MAGIC_ROUTER: Record<Network, RouterEndpoints> = {
  devnet: {
    http: 'https://devnet-router.magicblock.app',
    ws: 'wss://devnet-router.magicblock.app',
  },
  mainnet: {
    http: 'https://router.magicblock.app',
    ws: 'wss://router.magicblock.app',
  },
};

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_FEATURES: FeatureFlags = {
  gasless: false,
  privacy: false,
  vrf: false,
  cranks: false,
  oracle: false,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolve region-specific endpoints for a given network. */
export function getRegionConfig(region: Region, network: Network): RegionEndpoints {
  return REGIONS[region][network];
}

/** Resolve Magic Router endpoints for a given network. */
export function getMagicRouterEndpoints(network: Network): RouterEndpoints {
  return MAGIC_ROUTER[network];
}
