<script lang="ts">
	import '$lib/styles/dashboard.css';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { consoleClient } from '$lib/stores/client';
	import { clientVersion } from '$lib/stores/wallet';
	import { isValidPubkey } from '@magicblock-console/core';
	import type { Project, DelegatedAccount, StateDiff } from '@magicblock-console/core';

	let projects = $state<Project[]>([]);
	let selectedProject = $state('');
	let accounts = $state<DelegatedAccount[]>([]);
	let newAccount = $state('');
	let ownerProgram = $state('');
	let loading = $state(true);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let lastSimulated = $state<boolean | null>(null);
	let diffResult = $state<StateDiff | null>(null);
	let showDiff = $state(false);

	let prevVersion = $state(-1);
	$effect(() => {
		const v = $clientVersion;
		if (prevVersion >= 0 && v !== prevVersion) {
			loadProjects();
		}
		prevVersion = v;
	});

	const client = get(consoleClient);

	onMount(async () => {
		await loadProjects();
	});

	async function loadProjects() {
		loading = true;
		error = null;
		try {
			projects = await client.projects.list();
			if (projects.length > 0 && !selectedProject) {
				selectedProject = projects[0].name;
				await loadAccounts();
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	async function loadAccounts() {
		if (!selectedProject) return;
		error = null;
		try {
			accounts = await client.er.accounts(selectedProject);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function delegateAccount() {
		if (!newAccount.trim() || !selectedProject) {
			error = 'Account address and project are required';
			return;
		}
		if (!isValidPubkey(newAccount.trim())) {
			error = 'Invalid Solana address (expected base58, 32-44 characters)';
			return;
		}
		if (ownerProgram.trim() && !isValidPubkey(ownerProgram.trim())) {
			error = 'Invalid owner program address (expected base58, 32-44 characters)';
			return;
		}
		error = null;
		success = null;
		try {
			const result = await client.er.delegate({
				account: newAccount.trim(),
				project: selectedProject,
				ownerProgram: ownerProgram.trim() || undefined,
			});
			lastSimulated = result.simulated;
			const badge = result.simulated ? ' (simulated)' : '';
			success = `Delegated to ${result.validator}${badge}. Signature: ${result.signature.slice(0, 20)}...`;
			newAccount = '';
			ownerProgram = '';
			await loadAccounts();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function undelegateAccount(address: string) {
		error = null;
		try {
			await client.er.undelegate({
				account: address,
				project: selectedProject,
			});
			await loadAccounts();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function commitAccount(address: string) {
		error = null;
		success = null;
		try {
			const result = await client.er.commit({
				account: address,
				project: selectedProject,
			});
			lastSimulated = result.simulated;
			const badge = result.simulated ? ' (simulated)' : '';
			success = `Committed at slot ${result.slot}${badge}. Signature: ${result.signature.slice(0, 20)}...`;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function viewDiff(address: string) {
		error = null;
		try {
			diffResult = await client.er.diff(address);
			showDiff = true;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	function formatDate(date: Date): string {
		return new Date(date).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	function truncateAddress(addr: string): string {
		if (addr.length <= 12) return addr;
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	}

	async function onProjectChange() {
		await loadAccounts();
	}
</script>

<svelte:head>
	<title>ER Accounts — MagicBlock Console</title>
</svelte:head>

<div class="page">
	<div class="page-header">
		<h2 class="page-title">ER Accounts</h2>
	</div>

	{#if error}
		<div class="alert alert-error">{error}</div>
	{/if}

	{#if success}
		<div class="alert alert-success">
			{success}
			{#if lastSimulated !== null}
				<span class="source-badge" class:source-live={!lastSimulated} class:source-simulated={lastSimulated}>
					{lastSimulated ? 'simulated' : 'live'}
				</span>
			{/if}
		</div>
	{/if}

	{#if loading}
		<div class="loading-state">Loading...</div>
	{:else if projects.length === 0}
		<div class="empty-state">
			<p class="empty-text">Create a project first to manage delegated accounts.</p>
		</div>
	{:else}
		<div class="controls-row">
			<div class="form-group">
				<label class="form-label" for="er-project">Project</label>
				<select
					id="er-project"
					class="form-input"
					bind:value={selectedProject}
					onchange={onProjectChange}
				>
					{#each projects as p}
						<option value={p.name}>{p.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="card delegate-form">
			<h3 class="form-title">Delegate Account</h3>
			<form class="delegate-fields" onsubmit={(e) => { e.preventDefault(); delegateAccount(); }}>
				<div class="form-group">
					<label class="form-label" for="er-account">Account Address</label>
					<input
						id="er-account"
						class="form-input"
						type="text"
						bind:value={newAccount}
						placeholder="Account address (e.g. DYw8jC...)"
					/>
				</div>
				<div class="form-group">
					<label class="form-label" for="er-owner-program">Owner Program</label>
					<input
						id="er-owner-program"
						class="form-input"
						type="text"
						bind:value={ownerProgram}
						placeholder="Program that owns this account (e.g. game program)"
					/>
					<span class="form-hint">Required for live delegation. The Solana program that owns this account.</span>
				</div>
				<button type="submit" class="btn btn-primary">Delegate</button>
			</form>
		</div>

		{#if accounts.length === 0}
			<div class="empty-state">
				<p class="empty-text">No delegated accounts for this project.</p>
			</div>
		{:else}
			<div class="table-wrap">
				<table class="data-table">
					<thead>
						<tr>
							<th>Address</th>
							<th>Validator</th>
							<th>Delegated At</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each accounts as account}
							<tr>
								<td>
									<span class="mono" title={account.address}>
										{truncateAddress(account.address)}
									</span>
								</td>
								<td>
									<span class="mono" title={account.validator}>
										{truncateAddress(account.validator)}
									</span>
								</td>
								<td>{formatDate(account.delegatedAt)}</td>
								<td>
									<div class="action-btns">
										<button class="btn btn-sm" onclick={() => commitAccount(account.address)}>
											Commit
										</button>
										<button class="btn btn-sm" onclick={() => viewDiff(account.address)}>
											Diff
										</button>
										<button class="btn btn-sm btn-danger-sm" onclick={() => undelegateAccount(account.address)}>
											Undelegate
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if showDiff && diffResult}
			<div class="card diff-card">
				<div class="diff-header">
					<h3 class="form-title">State Diff</h3>
					<button class="btn btn-sm" onclick={() => (showDiff = false)}>Close</button>
				</div>
				<div class="diff-meta">
					<span class="mono">{diffResult.account}</span>
					<span class="diff-status" class:different={diffResult.isDifferent}>
						{diffResult.isDifferent ? 'Different' : 'In Sync'}
					</span>
				</div>
				<div class="diff-panels">
					<div class="diff-panel">
						<div class="diff-panel-label">Base Layer</div>
						<pre class="diff-content">{diffResult.baseLayerData}</pre>
					</div>
					<div class="diff-panel">
						<div class="diff-panel-label">Ephemeral Rollup</div>
						<pre class="diff-content">{diffResult.erData}</pre>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	/* Page-specific: wider layout */
	.page {
		max-width: 960px;
	}

	.controls-row {
		max-width: 300px;
	}

	.form-group {
		margin-bottom: 0;
	}

	.form-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-heading, #0f0f23);
		margin: 0 0 0.75rem;
	}

	.delegate-form {
		margin-bottom: 1.5rem;
	}

	.delegate-fields {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.delegate-fields .form-group {
		margin-bottom: 0;
	}

	.delegate-fields .btn {
		align-self: flex-start;
	}

	.form-hint {
		display: block;
		font-size: 0.75rem;
		color: var(--color-text-muted, #64748b);
		margin-top: 0.25rem;
	}

	.btn-sm {
		background: var(--color-bg, #f1f5f9);
		color: var(--color-text, #1a1a2e);
		border: 1px solid var(--color-border, #e2e8f0);
	}

	.btn-sm:hover {
		background: var(--color-border, #e2e8f0);
	}

	.btn-danger-sm {
		color: #ef4444;
		border-color: #fecaca;
	}

	.btn-danger-sm:hover {
		background: #fef2f2;
	}

	.table-wrap {
		margin-bottom: 1rem;
	}

	.data-table {
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 8px;
		overflow: hidden;
	}

	.data-table th,
	.data-table td {
		padding: 0.625rem 1rem;
	}

	.data-table th {
		background: var(--color-bg, #f8fafc);
	}

	.action-btns {
		display: flex;
		gap: 0.375rem;
	}

	/* Diff */
	.diff-card {
		margin-top: 1rem;
	}

	.diff-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.diff-header .form-title {
		margin: 0;
	}

	.diff-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.diff-status {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}

	.diff-status.different {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}

	.diff-panels {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.diff-panel-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-bottom: 0.375rem;
	}

	.diff-content {
		background: var(--color-pre-bg, #0f172a);
		color: var(--color-pre-text, #e2e8f0);
		padding: 0.75rem;
		border-radius: 6px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.8125rem;
		margin: 0;
		overflow-x: auto;
		white-space: pre-wrap;
	}

	@media (max-width: 768px) {
		.diff-panels {
			grid-template-columns: 1fr;
		}
	}
</style>
