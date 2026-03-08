import { writable } from 'svelte/store';
import { createClient, BrowserStorage } from '@magicblock-console/core';
import type { ConsoleClient } from '@magicblock-console/core';

const client = createClient({
	network: 'devnet',
	storage: new BrowserStorage(),
});

// Read-only blockchain connection is established in wallet.ts on browser load.
// When a wallet connects, it upgrades to full read+write mode.

export const consoleClient = writable<ConsoleClient>(client);
