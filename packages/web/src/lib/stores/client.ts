import { writable } from 'svelte/store';
import { createClient, BrowserStorage } from '@magicblock-console/core';
import type { ConsoleClient } from '@magicblock-console/core';

const client = createClient({
	network: 'devnet',
	storage: new BrowserStorage(),
});

// Enable read-only blockchain queries (status, diff) via Solana RPC.
// Write operations (delegate, undelegate, commit) remain simulated
// until a wallet adapter is integrated.
client.connectReadOnly();

export const consoleClient = writable<ConsoleClient>(client);
