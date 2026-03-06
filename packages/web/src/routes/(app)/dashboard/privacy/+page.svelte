<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { consoleClient } from '$lib/stores/client';
	import type { Project } from '@magicblock-console/core';

	let projects = $state<Project[]>([]);
	let selectedProject = $state('');
	let loading = $state(true);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);

	// Form state
	let activeTab = $state<'deposit' | 'transfer' | 'withdraw'>('deposit');
	let token = $state('SOL');
	let amount = $state(0);
	let recipient = $state('');
	let submitting = $state(false);

	const client = get(consoleClient);

	onMount(async () => {
		loading = true;
		try {
			projects = await client.projects.list();
			if (projects.length > 0) {
				selectedProject = projects[0].name;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	});

	async function handleSubmit() {
		if (!selectedProject) {
			error = 'Select a project first';
			return;
		}
		if (amount <= 0) {
			error = 'Amount must be greater than 0';
			return;
		}
		error = null;
		success = null;
		submitting = true;

		try {
			let signature: string;
			if (activeTab === 'deposit') {
				signature = await client.privacy.deposit({
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
				signature = await client.privacy.transfer({
					project: selectedProject,
					token,
					amount,
					to: recipient.trim(),
				});
			} else {
				signature = await client.privacy.withdraw({
					project: selectedProject,
					token,
					amount,
				});
			}
			success = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} successful. Signature: ${signature.slice(0, 24)}...`;
			amount = 0;
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
		<div class="alert alert-success">{success}</div>
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
				</div>

				<div class="form-group">
					<label class="form-label" for="privacy-amount">Amount</label>
					<input
						id="privacy-amount"
						class="form-input"
						type="number"
						step="0.001"
						min="0"
						bind:value={amount}
						placeholder="0.0"
					/>
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

				<button type="submit" class="btn btn-primary" disabled={submitting}>
					{submitting ? 'Processing...' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
				</button>
			</form>
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 600px;
	}

	.page-header {
		margin-bottom: 1.5rem;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-heading, #0f0f23);
		margin: 0;
	}

	.alert {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.alert-error {
		background: #fef2f2;
		color: #dc2626;
		border: 1px solid #fecaca;
	}

	.alert-success {
		background: #f0fdf4;
		color: #16a34a;
		border: 1px solid #bbf7d0;
	}

	.loading-state,
	.empty-state {
		text-align: center;
		padding: 2rem 1rem;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}

	.empty-text {
		color: var(--color-text-muted, #64748b);
	}

	.controls-row {
		margin-bottom: 1rem;
		max-width: 300px;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-label {
		display: block;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
		margin-bottom: 0.375rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.form-input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 6px;
		background: var(--color-bg, #f8fafc);
		color: var(--color-text, #1a1a2e);
		outline: none;
		box-sizing: border-box;
	}

	.form-input:focus {
		border-color: var(--color-primary, #8b5cf6);
		box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
	}

	.select-narrow {
		max-width: 300px;
	}

	.card {
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 8px;
		padding: 1.25rem;
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
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 6px;
		border: none;
		cursor: pointer;
		transition: background 0.15s;
		white-space: nowrap;
		align-self: flex-start;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background: var(--color-primary, #8b5cf6);
		color: #ffffff;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--color-primary-hover, #7c3aed);
	}
</style>
