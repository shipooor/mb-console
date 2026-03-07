import { writable } from 'svelte/store';
import { createClient, BrowserStorage } from '@magicblock-console/core';
import type { ConsoleClient } from '@magicblock-console/core';

const client = createClient({
	network: 'devnet',
	storage: new BrowserStorage(),
});

// Web dashboard runs in simulated mode.
// connectReadOnly() is not called here because the MagicBlock SDK
// and @solana/web3.js Connection classes use Node.js APIs that are
// not available in the browser. Real blockchain queries will be
// enabled when a browser-compatible wallet adapter is integrated.

export const consoleClient = writable<ConsoleClient>(client);
