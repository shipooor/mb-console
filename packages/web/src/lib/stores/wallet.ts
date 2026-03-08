import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { consoleClient } from './client';
import type { PublicKey, Transaction } from '@solana/web3.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PhantomProvider {
	isPhantom: boolean;
	publicKey: PublicKey | null;
	connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: PublicKey }>;
	disconnect(): Promise<void>;
	signTransaction(tx: Transaction): Promise<Transaction>;
	on(event: string, handler: (...args: unknown[]) => void): void;
	off(event: string, handler: (...args: unknown[]) => void): void;
}

interface WalletState {
	connecting: boolean;
	address: string | null;
	balance: number | null;
	error: string | null;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const initial: WalletState = {
	connecting: false,
	address: null,
	balance: null,
	error: null,
};

export const wallet = writable<WalletState>(initial);

/**
 * Numeric counter that increments on connect/disconnect.
 * Dashboard pages watch this to re-fetch data when wallet state changes.
 */
export const clientVersion = writable<number>(0);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPhantom(): PhantomProvider | null {
	if (!browser) return null;
	const win = window as unknown as { phantom?: { solana?: PhantomProvider } };
	if (win.phantom?.solana?.isPhantom) {
		return win.phantom.solana;
	}
	return null;
}

function truncateAddress(addr: string): string {
	if (addr.length <= 10) return addr;
	return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

// ---------------------------------------------------------------------------
// Balance
// ---------------------------------------------------------------------------

const LAMPORTS_PER_SOL = 1_000_000_000;

/**
 * Fetch SOL balance via direct RPC call (no @solana/web3.js dependency).
 * Updates the wallet store with the result.
 */
async function fetchBalance(address: string): Promise<void> {
	try {
		const resp = await fetch('https://api.devnet.solana.com', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method: 'getBalance',
				params: [address],
			}),
		});
		const data = await resp.json();
		if (data.result?.value !== undefined) {
			const sol = data.result.value / LAMPORTS_PER_SOL;
			wallet.update((s) => ({ ...s, balance: sol }));
		}
	} catch {
		// Non-critical — balance display is optional
	}
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

async function connect(): Promise<void> {
	const current = get(wallet);
	if (current.connecting) return;

	const phantom = getPhantom();
	if (!phantom) {
		wallet.set({ connecting: false, address: null, error: 'Phantom wallet not found. Please install it from phantom.app' });
		return;
	}

	wallet.update((s) => ({ ...s, connecting: true, error: null }));

	try {
		const { publicKey } = await phantom.connect();
		if (!publicKey || typeof publicKey.toBase58 !== 'function') {
			throw new Error('Invalid public key returned from wallet');
		}
		const address = publicKey.toBase58();

		const client = get(consoleClient);
		await client.connectWithSigner({
			publicKey,
			signTransaction: (tx: Transaction) => phantom.signTransaction(tx),
		});

		wallet.set({ connecting: false, address, balance: null, error: null });
		clientVersion.update((v) => v + 1);

		// Fetch SOL balance to confirm blockchain connection is live
		fetchBalance(address);

		// Listen for Phantom events
		phantom.on('disconnect', handlePhantomDisconnect);
		phantom.on('accountChanged', handleAccountChanged);
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message.slice(0, 120) : 'Connection failed';
		wallet.set({ connecting: false, address: null, balance: null, error: msg });
	}
}

async function disconnect(): Promise<void> {
	const phantom = getPhantom();
	if (phantom) {
		phantom.off('disconnect', handlePhantomDisconnect);
		phantom.off('accountChanged', handleAccountChanged);
		try {
			await phantom.disconnect();
		} catch {
			// Ignore disconnect errors
		}
	}

	const client = get(consoleClient);
	client.disconnect();

	wallet.set({ connecting: false, address: null, balance: null, error: null });
	clientVersion.update((v) => v + 1);
}

function handlePhantomDisconnect(): void {
	const client = get(consoleClient);
	client.disconnect();
	wallet.set({ connecting: false, address: null, balance: null, error: null });
	clientVersion.update((v) => v + 1);
}

async function handleAccountChanged(newPublicKey: unknown): Promise<void> {
	if (!newPublicKey) {
		// Account removed — treat as disconnect
		handlePhantomDisconnect();
		return;
	}
	// Clean up old connection before reconnecting with new account
	const phantom = getPhantom();
	if (phantom) {
		phantom.off('disconnect', handlePhantomDisconnect);
		phantom.off('accountChanged', handleAccountChanged);
	}
	const client = get(consoleClient);
	client.disconnect();
	wallet.set({ connecting: false, address: null, balance: null, error: null });

	await connect();
}

// ---------------------------------------------------------------------------
// Eager Reconnect
// ---------------------------------------------------------------------------

/**
 * Silently reconnect if user previously approved this dApp.
 * Uses Phantom's `onlyIfTrusted` flag — no popup shown.
 */
async function eagerConnect(): Promise<void> {
	const phantom = getPhantom();
	if (!phantom) return;

	try {
		const { publicKey } = await phantom.connect({ onlyIfTrusted: true });
		if (!publicKey || typeof publicKey.toBase58 !== 'function') return;
		const address = publicKey.toBase58();

		const client = get(consoleClient);
		await client.connectWithSigner({
			publicKey,
			signTransaction: (tx: Transaction) => phantom.signTransaction(tx),
		});

		wallet.set({ connecting: false, address, balance: null, error: null });
		clientVersion.update((v) => v + 1);
		fetchBalance(address);

		phantom.on('disconnect', handlePhantomDisconnect);
		phantom.on('accountChanged', handleAccountChanged);
	} catch {
		// User hasn't approved this dApp yet — stay disconnected
	}
}

// Auto-reconnect on page load
if (browser) {
	eagerConnect();
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const walletActions = {
	connect,
	disconnect,
	truncateAddress,
	getPhantom,
};
