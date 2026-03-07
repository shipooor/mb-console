// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------

const BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Generate a random base58 string of the given length.
 * Uses crypto.getRandomValues() for secure randomness.
 */
export function generateBase58(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE58_CHARS[bytes[i]! % BASE58_CHARS.length];
  }
  return result;
}

/** Generate a realistic-looking base58 transaction signature (88 chars). */
export function generateSignature(): string {
  return generateBase58(88);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Validate that a string looks like a Solana public key (base58, 32-44 chars).
 * Does NOT verify that the key is on-curve — only checks format.
 */
export function isValidPubkey(value: string): boolean {
  return BASE58_REGEX.test(value);
}

/**
 * Assert that a value is a valid-looking Solana public key.
 * Throws a descriptive error if invalid.
 */
export function assertPubkey(value: string, label = 'address'): void {
  if (!isValidPubkey(value)) {
    throw new Error(
      `Invalid Solana ${label}: "${value}". ` +
      'Expected a base58-encoded public key (32-44 characters).',
    );
  }
}
