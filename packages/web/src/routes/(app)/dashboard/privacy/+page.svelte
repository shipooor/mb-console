<script lang="ts">
	import '$lib/styles/dashboard.css';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { consoleClient } from '$lib/stores/client';
	import { wallet, clientVersion } from '$lib/stores/wallet';
	import { isValidPubkey } from '@magicblock-console/core';
	import type { Project, PrivacyResult } from '@magicblock-console/core';

	let projects = $state<Project[]>([]);
	let selectedProject = $state('');
	let loading = $state(true);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let lastResult = $state<PrivacyResult | null>(null);

	// Form state
	let activeTab = $state<'deposit' | 'transfer' | 'withdraw'>('deposit');
	let token = $state('SOL');
	let amount = $state<number | null>(null);
	let recipient = $state('');
	let submitting = $state(false);

	let prevVersion = $state(-1);
	$effect(() => {
		const v = $clientVersion;
		if (prevVersion >= 0 && v !== prevVersion) {
			loadData();
		}
		prevVersion = v;
	});

	const client = get(consoleClient);

	async function loadData() {
		loading = true;
		try {
			projects = await client.projects.list();
			if (projects.length > 0 && !selectedProject) {
				selectedProject = projects[0].name;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		await loadData();
	});

	async function handleSubmit() {
		if (!selectedProject) {
			error = 'Select a project first';
			return;
		}
		if (!amount || amount <= 0) {
			error = 'Amount must be greater than 0';
			return;
		}
		error = null;
		success = null;
		lastResult = null;
		submitting = true;

		try {
			let result: PrivacyResult;
			if (activeTab === 'deposit') {
				result = await client.privacy.deposit({
					project: selectedProject,
					token,
					amount,
				});
			} else if (activeTab === 'transfer') {
				if (!recipient.trim()) {
					error = 'Recipient address is required';
					submitting = false;
					return;
				}
				if (!isValidPubkey(recipient.trim())) {
					error = 'Invalid recipient address (expected base58, 32-44 characters)';
					submitting = false;
					return;
				}
				result = await client.privacy.transfer({
					project: selectedProject,
					token,
					amount,
					to: recipient.trim(),
				});
			} else {
				result = await client.privacy.withdraw({
					project: selectedProject,
					token,
					amount,
				});
			}
			lastResult = result;
			const badge = result.simulated ? ' (simulated)' : '';
			success = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} successful${badge}. Signature: ${result.signature.slice(0, 24)}...`;
			amount = null;
			recipient = '';
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Privacy — MagicBlock Console</title>
</svelte:head>

<div class="page">
	<div class="page-header">
		<h2 class="page-title">Confidential Transfers</h2>
	</div>

	{#if error}
		<div class="alert alert-error">{error}</div>
	{/if}

	{#if success}
		<div class="alert alert-success">
			{success}
			{#if lastResult}
				<span class="source-badge" class:source-live={!lastResult.simulated} class:source-simulated={lastResult.simulated}>
					{lastResult.simulated ? 'simulated' : 'live'}
				</span>
			{/if}
		</div>
	{/if}

	{#if loading}
		<div class="loading-state">Loading...</div>
	{:else if projects.length === 0}
		<div class="empty-state">
			<p class="empty-text">Create a project with Privacy enabled first.</p>
		</div>
	{:else}
		<div class="controls-row">
			<div class="form-group">
				<label class="form-label" for="privacy-project">Project</label>
				<select id="privacy-project" class="form-input select-narrow" bind:value={selectedProject}>
					{#each projects as p}
						<option value={p.name}>{p.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="card">
			<div class="tabs">
				<button
					class="tab"
					class:active={activeTab === 'deposit'}
					onclick={() => (activeTab = 'deposit')}
				>
					Deposit
				</button>
				<button
					class="tab"
					class:active={activeTab === 'transfer'}
					onclick={() => (activeTab = 'transfer')}
				>
					Transfer
				</button>
				<button
					class="tab"
					class:active={activeTab === 'withdraw'}
					onclick={() => (activeTab = 'withdraw')}
				>
					Withdraw
				</button>
			</div>

			<form class="privacy-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
				<div class="form-group">
					<label class="form-label" for="privacy-token">Token</label>
					<select id="privacy-token" class="form-input" bind:value={token}>
						<option value="SOL">SOL</option>
						<option value="USDC">USDC</option>
						<option value="USDT">USDT</option>
					</select>
					{#if $wallet.balance !== null && token === 'SOL'}
						<div class="balance-hint">Balance: {$wallet.balance.toFixed(4)} SOL</div>
					{/if}
				</div>

				<div class="form-group">
					<label class="form-label" for="privacy-amount">Amount</label>
					<div class="amount-row">
						<input
							id="privacy-amount"
							class="form-input"
							type="number"
							step="0.001"
							min="0"
							bind:value={amount}
							placeholder="0.0"
						/>
						{#if activeTab === 'deposit' && $wallet.balance !== null && token === 'SOL'}
							<button
								type="button"
								class="btn-max"
								onclick={() => { amount = Math.max(0, parseFloat(($wallet.balance! - 0.01).toFixed(4))); }}
							>
								Max
							</button>
						{/if}
					</div>
				</div>

				{#if activeTab === 'transfer'}
					<div class="form-group">
						<label class="form-label" for="privacy-recipient">Recipient Address</label>
						<input
							id="privacy-recipient"
							class="form-input"
							type="text"
							bind:value={recipient}
							placeholder="Recipient wallet address"
						/>
					</div>
				{/if}

				{#if activeTab === 'withdraw'}
					<div class="tab-note">
						Withdrawal requires the TEE validator to release delegated tokens back to the base chain. This may fail if the account has not been fully committed by the TEE yet.
					</div>
				{/if}

				<button type="submit" class="btn btn-primary" disabled={submitting}>
					{submitting ? 'Processing...' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
				</button>
			</form>
		</div>

		<div class="info-note">
			<strong>Simulated vs Live.</strong> Deposits run live when a Phantom wallet is connected — SOL is wrapped to wSOL and delegated to the TEE validator. Transfer and Withdraw are currently simulated as they require the TEE Privacy Engine API, which is not yet publicly available.
		</div>
	{/if}
</div>

<style>
	/* Page-specific: narrow layout */
	.page {
		max-width: 600px;
	}

	.controls-row {
		max-width: 300px;
	}

	.select-narrow {
		max-width: 300px;
	}

	.tabs {
		display: flex;
		gap: 0;
		margin-bottom: 1.25rem;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.tab {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		transition: color 0.15s, border-color 0.15s;
		margin-bottom: -1px;
	}

	.tab:hover {
		color: var(--color-text, #1a1a2e);
	}

	.tab.active {
		color: var(--color-primary, #8b5cf6);
		border-bottom-color: var(--color-primary, #8b5cf6);
	}

	.privacy-form {
		display: flex;
		flex-direction: column;
	}

	.btn {
		align-self: flex-start;
	}

	.balance-hint {
		font-size: 0.75rem;
		color: var(--color-text-muted, #64748b);
		margin-top: 0.25rem;
	}

	.amount-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.amount-row .form-input {
		flex: 1;
		min-width: 0;
	}

	.btn-max {
		padding: 0.25rem 0.625rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-primary, #8b5cf6);
		background: var(--color-primary-alpha, rgba(20, 241, 149, 0.1));
		border: 1px solid var(--color-primary, #8b5cf6);
		border-radius: 999px;
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.15s, color 0.15s;
	}

	.btn-max:hover {
		background: var(--color-primary, #8b5cf6);
		color: #fff;
	}

	.tab-note {
		font-size: 0.8rem;
		color: var(--color-text-muted, #64748b);
		background: var(--color-surface-alt, #f8fafc);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 6px;
		padding: 0.625rem 0.75rem;
		margin-bottom: 0.75rem;
		line-height: 1.5;
	}

	/* Source badges inherited from dashboard.css */
	.source-badge {
		margin-left: 0.5rem;
	}
</style>
