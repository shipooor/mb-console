import { writable } from 'svelte/store';
import { createClient, BrowserStorage } from '@magicblock-console/core';
import type { ConsoleClient } from '@magicblock-console/core';

const client = createClient({
	network: 'devnet',
	storage: new BrowserStorage(),
});

export const consoleClient = writable<ConsoleClient>(client);
