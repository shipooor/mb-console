<script lang="ts">
	import '$lib/styles/dashboard.css';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { consoleClient } from '$lib/stores/client';
	import type { Project, Crank } from '@magicblock-console/core';

	let projects = $state<Project[]>([]);
	let selectedProject = $state('');
	let cranks = $state<Crank[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Create form
	let showCreateForm = $state(false);
	let intervalMs = $state(1000);
	let iterations = $state(10);
	let account = $state('');
	let creating = $state(false);

	const client = get(consoleClient);

	onMount(async () => {
		loading = true;
		try {
			projects = await client.projects.list();
			if (projects.length > 0) {
				selectedProject = projects[0].name;
				await loadCranks();
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	});

	async function loadCranks() {
		if (!selectedProject) return;
		error = null;
		try {
			cranks = await client.cranks.list(selectedProject);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function createCrank() {
		if (!selectedProject) return;
		error = null;
		creating = true;
		try {
			await client.cranks.create({
				project: selectedProject,
				intervalMs,
				iterations,
				account: account.trim() || undefined,
			});
			showCreateForm = false;
			intervalMs = 1000;
			iterations = 10;
			account = '';
			await loadCranks();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			creating = false;
		}
	}

	async function stopCrank(id: string) {
		error = null;
		try {
			await client.cranks.stop(id);
			await loadCranks();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function onProjectChange() {
		await loadCranks();
	}

	function statusColor(status: Crank['status']): string {
		switch (status) {
			case 'running':
				return 'status-running';
			case 'completed':
				return 'status-completed';
			case 'stopped':
				return 'status-stopped';
			default:
				return '';
		}
	}
</script>

<svelte:head>
	<title>Cranks — MagicBlock Console</title>
</svelte:head>

<div class="page">
	<div class="page-header">
		<h2 class="page-title">Cranks</h2>
		{#if projects.length > 0}
			<button class="btn btn-primary" onclick={() => (showCreateForm = !showCreateForm)}>
				{showCreateForm ? 'Cancel' : 'New Crank'}
			</button>
		{/if}
	</div>

	{#if error}
		<div class="alert alert-error">{error}</div>
	{/if}

	{#if loading}
		<div class="loading-state">Loading...</div>
	{:else if projects.length === 0}
		<div class="empty-state">
			<p class="empty-text">Create a project with Cranks enabled first.</p>
		</div>
	{:else}
		<div class="controls-row">
			<div class="form-group">
				<label class="form-label" for="cranks-project">Project</label>
				<select
					id="cranks-project"
					class="form-input select-narrow"
					bind:value={selectedProject}
					onchange={onProjectChange}
				>
					{#each projects as p}
						<option value={p.name}>{p.name}</option>
					{/each}
				</select>
			</div>
		</div>

		{#if showCreateForm}
			<div class="card create-form">
				<h3 class="form-title">Create Crank</h3>
				<form onsubmit={(e) => { e.preventDefault(); createCrank(); }}>
					<div class="form-row">
						<div class="form-group">
							<label class="form-label" for="crank-interval">Interval (ms)</label>
							<input
								id="crank-interval"
								class="form-input"
								type="number"
								min="100"
								bind:value={intervalMs}
							/>
						</div>
						<div class="form-group">
							<label class="form-label" for="crank-iterations">Iterations</label>
							<input
								id="crank-iterations"
								class="form-input"
								type="number"
								min="1"
								bind:value={iterations}
							/>
						</div>
					</div>
					<div class="form-group">
						<label class="form-label" for="crank-account">Account (optional)</label>
						<input
							id="crank-account"
							class="form-input"
							type="text"
							bind:value={account}
							placeholder="Solana account pubkey for real commits"
						/>
					</div>
					<div class="form-actions">
						<button type="button" class="btn btn-secondary" onclick={() => (showCreateForm = false)}>
							Cancel
						</button>
						<button type="submit" class="btn btn-primary" disabled={creating}>
							{creating ? 'Creating...' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		{/if}

		{#if cranks.length === 0}
			<div class="empty-state">
				<p class="empty-text">No cranks for this project.</p>
			</div>
		{:else}
			<div class="table-wrap">
				<table class="data-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Interval</th>
							<th>Iterations</th>
							<th>Executed</th>
							<th>Status</th>
							<th>Mode</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each cranks as crank}
							<tr>
								<td class="mono">{crank.id}</td>
								<td>{crank.intervalMs}ms</td>
								<td>{crank.iterations || 'unlimited'}</td>
								<td>{crank.executed}</td>
								<td>
									<span class="status-badge {statusColor(crank.status)}">
										{crank.status}
									</span>
								</td>
								<td>
									<span class="source-badge" class:source-live={!crank.simulated} class:source-simulated={crank.simulated}>
										{crank.simulated ? 'simulated' : 'live'}
									</span>
								</td>
								<td>
									{#if crank.status === 'running'}
										<button class="btn btn-sm btn-danger-sm" onclick={() => stopCrank(crank.id)}>
											Stop
										</button>
									{:else}
										<span class="text-muted">--</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/if}
</div>

<style>
	/* Page-specific: narrow controls row */
	.controls-row {
		max-width: 300px;
	}

	.select-narrow {
		max-width: 300px;
	}

	.card {
		margin-bottom: 1.5rem;
	}

	.form-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-heading, #0f0f23);
		margin: 0 0 1rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.data-table {
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 8px;
		overflow: hidden;
	}

	.data-table th {
		background: var(--color-bg, #f8fafc);
	}

	.mono {
		font-size: 0.75rem;
	}

	.btn-danger-sm {
		background: transparent;
		color: #ef4444;
		border: 1px solid #fecaca;
	}

	.btn-danger-sm:hover {
		background: #fef2f2;
	}

	.text-muted {
		color: var(--color-text-muted, #94a3b8);
	}

	.status-badge {
		display: inline-flex;
		padding: 0.0625rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: capitalize;
	}

	.status-running {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}

	.status-completed {
		background: rgba(59, 130, 246, 0.1);
		color: #3b82f6;
	}

	.status-stopped {
		background: rgba(148, 163, 184, 0.15);
		color: #64748b;
	}

	/* Source badges inherited from dashboard.css */
</style>
