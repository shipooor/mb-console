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
			<span class="brand-text">MagicBlock Console</span>
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
			<a class="shipped-by" href="https://x.com/shipooor" target="_blank" rel="noopener">
				<span class="shipped-stamp">S</span>
				<span class="shipped-text">shipped by shipooor</span>
			</a>
		</div>
	</aside>

	<div class="main-area">
		<header class="topbar">
			<div></div>
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
		background: var(--color-bg);
	}

	/* Sidebar */
	.sidebar {
		width: 220px;
		min-width: 220px;
		background: var(--color-surface);
		color: var(--color-text);
		display: flex;
		flex-direction: column;
		padding: 0;
		border-right: 1px solid var(--color-border);
	}

	.sidebar-brand {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0 1rem;
		height: 48px;
		border-bottom: 1px solid var(--color-border);
	}

	.brand-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: var(--color-primary);
		color: #0B0F1A;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	.brand-text {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-heading);
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
		color: var(--color-text-muted);
		font-size: 0.875rem;
		font-weight: 500;
		transition: background 0.15s, color 0.15s;
	}

	.nav-item:hover {
		background: rgba(139, 92, 246, 0.06);
		color: var(--color-text);
	}

	.nav-item.active {
		background: rgba(139, 92, 246, 0.12);
		color: var(--color-primary);
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
		background: rgba(139, 92, 246, 0.2);
		color: var(--color-primary);
	}

	.nav-label {
		white-space: nowrap;
	}

	.sidebar-footer {
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.shipped-by {
		display: flex;
		align-items: center;
		gap: 8px;
		text-decoration: none;
		color: var(--color-text-muted);
		font-size: 0.75rem;
		font-weight: 500;
		transition: all 0.3s ease;
		position: relative;
		margin-top: 0.25rem;
	}

	.shipped-by:hover {
		color: #fff;
		text-shadow: 0 0 8px rgba(192,132,252, 0.8), 0 0 20px rgba(139,92,246, 0.5);
	}

	.shipped-by:hover .shipped-stamp {
		background: var(--color-primary);
		border-color: transparent;
		color: #fff;
		box-shadow: 0 0 12px rgba(139,92,246, 0.6), 0 0 30px rgba(139,92,246, 0.3);
		animation: stamp-chaos 0.6s ease;
	}

	/* Spark particles */
	.shipped-by::before,
	.shipped-by::after {
		content: '';
		position: absolute;
		border-radius: 50%;
		opacity: 0;
		pointer-events: none;
	}
	.shipped-by::before { width: 4px; height: 4px; background: #c084fc; }
	.shipped-by::after { width: 5px; height: 5px; background: #a78bfa; }
	.shipped-by:hover::before { animation: spark1 0.7s ease-out forwards; }
	.shipped-by:hover::after { animation: spark2 0.7s 0.05s ease-out forwards; }

	@keyframes stamp-chaos {
		0% { transform: rotate(-3deg) scale(1); }
		15% { transform: rotate(15deg) scale(1.4); }
		30% { transform: rotate(-10deg) scale(1.2); }
		50% { transform: rotate(360deg) scale(0.8); }
		70% { transform: rotate(375deg) scale(1.15); }
		85% { transform: rotate(355deg) scale(1.05); }
		100% { transform: rotate(357deg) scale(1.1); }
	}

	@keyframes spark1 {
		0% { left: 10px; top: 50%; opacity: 1; transform: scale(1); box-shadow: 0 0 6px #c084fc; }
		100% { left: -16px; top: -10px; opacity: 0; transform: scale(0.3); box-shadow: 0 0 0 transparent; }
	}
	@keyframes spark2 {
		0% { left: 10px; top: 50%; opacity: 1; transform: scale(1); box-shadow: 0 0 8px #a78bfa; }
		100% { left: 34px; top: -12px; opacity: 0; transform: scale(0.2); box-shadow: 0 0 0 transparent; }
	}

	.shipped-stamp {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border: 1.5px solid rgba(139,92,246, 0.4);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 9px;
		font-weight: 700;
		color: #c084fc;
		background: rgba(139,92,246, 0.08);
		transform: rotate(-3deg);
		transition: all 0.3s ease;
		flex-shrink: 0;
	}

	.shipped-text { white-space: nowrap; }

	.network-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		background: rgba(139, 92, 246, 0.15);
		color: var(--color-primary);
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
		height: 48px;
		background: rgba(11, 15, 26, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--color-border);
	}

	.wallet-area {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.wallet-error {
		font-size: 0.75rem;
		color: #F87171;
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
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--color-border);
	}

	.wallet-connected {
		border-color: rgba(139, 92, 246, 0.3);
	}

	.wallet-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-warning);
	}

	.wallet-dot-connected {
		background: var(--color-primary);
	}

	.wallet-text {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text-muted);
	}

	.wallet-connected .wallet-text {
		color: var(--color-text);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
	}

	.wallet-balance {
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--color-primary);
		padding-left: 0.375rem;
		border-left: 1px solid var(--color-border);
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
		background: var(--color-primary);
		color: #0B0F1A;
	}

	.wallet-btn-connect:hover:not(:disabled) {
		background: var(--color-primary-hover);
	}

	.wallet-btn-disconnect {
		background: rgba(255, 255, 255, 0.05);
		color: var(--color-text-muted);
		border: 1px solid var(--color-border);
	}

	.wallet-btn-disconnect:hover {
		background: rgba(255, 255, 255, 0.1);
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
