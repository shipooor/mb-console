<script lang="ts">
	import '$lib/polyfills';
	import { page } from '$app/state';
	import { wallet, walletActions } from '$lib/stores/wallet';

	let { children } = $props();

	const navItems = [
		{ href: '/dashboard', label: 'Projects', icon: 'P' },
		{ href: '/dashboard/er', label: 'ER Accounts', icon: 'E' },
		{ href: '/dashboard/vrf', label: 'VRF', icon: 'R' },
		{ href: '/dashboard/privacy', label: 'Privacy', icon: 'S' },
		{ href: '/dashboard/cranks', label: 'Cranks', icon: 'C' },
		{ href: '/dashboard/oracle', label: 'Oracle', icon: 'O' },
		{ href: '/dashboard/monitor', label: 'Monitor', icon: 'M' },
	];

	function isActive(href: string): boolean {
		const path = page.url.pathname;
		if (href === '/dashboard') {
			return path === '/dashboard';
		}
		return path.startsWith(href);
	}
</script>

<div class="app-shell">
	<aside class="sidebar">
		<div class="sidebar-brand">
			<span class="brand-icon">MB</span>
			<span class="brand-text">MagicBlock</span>
		</div>

		<nav class="sidebar-nav">
			{#each navItems as item}
				<a
					href={item.href}
					class="nav-item"
					class:active={isActive(item.href)}
				>
					<span class="nav-icon">{item.icon}</span>
					<span class="nav-label">{item.label}</span>
				</a>
			{/each}
		</nav>

		<div class="sidebar-footer">
			<span class="network-badge">devnet</span>
		</div>
	</aside>

	<div class="main-area">
		<header class="topbar">
			<h1 class="topbar-title">MagicBlock Console</h1>
			<div class="wallet-area">
				{#if $wallet.error}
					<span class="wallet-error">{$wallet.error}</span>
				{/if}
				{#if $wallet.address}
					<div class="wallet-status wallet-connected">
						<span class="wallet-dot wallet-dot-connected"></span>
						<span class="wallet-text">{walletActions.truncateAddress($wallet.address)}</span>
						{#if $wallet.balance !== null}
							<span class="wallet-balance">{$wallet.balance.toFixed(4)} SOL</span>
						{/if}
					</div>
					<button class="wallet-btn wallet-btn-disconnect" onclick={() => walletActions.disconnect()}>
						Disconnect
					</button>
				{:else}
					<div class="wallet-status">
						<span class="wallet-dot"></span>
						<span class="wallet-text">Devnet</span>
					</div>
					<button
						class="wallet-btn wallet-btn-connect"
						onclick={() => walletActions.connect()}
						disabled={$wallet.connecting}
					>
						{$wallet.connecting ? 'Connecting...' : 'Connect Wallet'}
					</button>
				{/if}
			</div>
		</header>

		<main class="content">
			{@render children()}
		</main>
	</div>
</div>

<style>
	.app-shell {
		display: flex;
		min-height: 100vh;
		background: var(--color-bg, #f8fafc);
	}

	/* Sidebar */
	.sidebar {
		width: 220px;
		min-width: 220px;
		background: var(--color-sidebar-bg, #0f172a);
		color: var(--color-sidebar-text, #cbd5e1);
		display: flex;
		flex-direction: column;
		padding: 0;
	}

	.sidebar-brand {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 1.25rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.brand-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: var(--color-primary-bright, #14f195);
		color: #0c1222;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	.brand-text {
		font-size: 0.9375rem;
		font-weight: 600;
		color: #f1f5f9;
	}

	.sidebar-nav {
		flex: 1;
		padding: 0.75rem 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		text-decoration: none;
		color: var(--color-sidebar-text, #94a3b8);
		font-size: 0.875rem;
		font-weight: 500;
		transition: background 0.15s, color 0.15s;
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.06);
		color: #e2e8f0;
	}

	.nav-item.active {
		background: rgba(20, 241, 149, 0.15);
		color: var(--color-primary-bright, #14f195);
	}

	.nav-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.06);
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.03em;
	}

	.nav-item.active .nav-icon {
		background: rgba(20, 241, 149, 0.25);
		color: var(--color-primary-bright, #14f195);
	}

	.nav-label {
		white-space: nowrap;
	}

	.sidebar-footer {
		padding: 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.network-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		background: rgba(16, 185, 129, 0.15);
		color: #10b981;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Main area */
	.main-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1.5rem;
		height: 56px;
		background: var(--color-navbar-bg, #0c1222);
		border-bottom: 1px solid var(--color-navbar-border, #1e293b);
	}

	.topbar-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-navbar-text, #e2e8f0);
		margin: 0;
	}

	.wallet-area {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.wallet-error {
		font-size: 0.75rem;
		color: #ef4444;
		max-width: 240px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.wallet-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.75rem;
		border-radius: 9999px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.wallet-connected {
		border-color: rgba(20, 241, 149, 0.3);
	}

	.wallet-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #f59e0b;
	}

	.wallet-dot-connected {
		background: #10b981;
	}

	.wallet-text {
		font-size: 0.8125rem;
		font-weight: 500;
		color: rgba(226, 232, 240, 0.7);
	}

	.wallet-connected .wallet-text {
		color: #e2e8f0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
	}

	.wallet-balance {
		font-size: 0.6875rem;
		font-weight: 600;
		color: #10b981;
		padding-left: 0.375rem;
		border-left: 1px solid rgba(255, 255, 255, 0.15);
	}

	.wallet-btn {
		padding: 0.375rem 0.75rem;
		border-radius: 6px;
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		border: none;
		transition: background 0.15s, opacity 0.15s;
	}

	.wallet-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.wallet-btn-connect {
		background: var(--color-primary-bright, #14f195);
		color: #0c1222;
	}

	.wallet-btn-connect:hover:not(:disabled) {
		background: var(--color-primary-bright-hover, #0ed886);
	}

	.wallet-btn-disconnect {
		background: rgba(255, 255, 255, 0.08);
		color: rgba(226, 232, 240, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.wallet-btn-disconnect:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.content {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.sidebar {
			width: 60px;
			min-width: 60px;
		}

		.brand-text,
		.nav-label,
		.sidebar-footer {
			display: none;
		}

		.sidebar-brand {
			justify-content: center;
			padding: 1rem 0.5rem;
		}

		.sidebar-nav {
			padding: 0.75rem 0.25rem;
		}

		.nav-item {
			justify-content: center;
			padding: 0.5rem;
		}

		.content {
			padding: 1rem;
		}
	}
</style>
