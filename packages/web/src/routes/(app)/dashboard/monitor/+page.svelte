<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { consoleClient } from '$lib/stores/client';
	import type {
		Project,
		ProjectStatus,
		CostBreakdown,
		LogEntry,
	} from '@magicblock-console/core';

	let projects = $state<Project[]>([]);
	let selectedProject = $state('');
	let loading = $state(true);
	let error = $state<string | null>(null);
	let status = $state<ProjectStatus | null>(null);
	let costs = $state<CostBreakdown | null>(null);
	let logs = $state<LogEntry[]>([]);

	const client = get(consoleClient);

	onMount(async () => {
		loading = true;
		try {
			projects = await client.projects.list();
			if (projects.length > 0) {
				selectedProject = projects[0].name;
				await loadMonitorData();
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	});

	async function loadMonitorData() {
		if (!selectedProject) return;
		error = null;
		try {
			const [s, c, l] = await Promise.all([
				client.monitor.status(selectedProject),
				client.monitor.costs(selectedProject),
				client.monitor.logs(selectedProject, 20),
			]);
			status = s;
			costs = c;
			logs = l;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function onProjectChange() {
		await loadMonitorData();
	}

	function formatDate(date: Date): string {
		return new Date(date).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	}

	function formatSol(value: number): string {
		return value.toFixed(6) + ' SOL';
	}
</script>

<svelte:head>
	<title>Monitor — MagicBlock Console</title>
</svelte:head>

<div class="page">
	<div class="page-header">
		<h2 class="page-title">Monitor</h2>
	</div>

	{#if error}
		<div class="alert alert-error">{error}</div>
	{/if}

	{#if loading}
		<div class="loading-state">Loading...</div>
	{:else if projects.length === 0}
		<div class="empty-state">
			<p class="empty-text">Create a project to view monitoring data.</p>
		</div>
	{:else}
		<div class="controls-row">
			<div class="form-group">
				<label class="form-label" for="monitor-project">Project</label>
				<select
					id="monitor-project"
					class="form-input select-narrow"
					bind:value={selectedProject}
					onchange={onProjectChange}
				>
					{#each projects as p}
						<option value={p.name}>{p.name}</option>
					{/each}
				</select>
			</div>
			<button class="btn btn-secondary" onclick={loadMonitorData}>Refresh</button>
		</div>

		{#if status}
			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-label">Region</span>
					<span class="stat-value">{status.region.toUpperCase()}</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Accounts</span>
					<span class="stat-value">{status.accounts.length}</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Uptime</span>
					<span class="stat-value">{status.uptime}%</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Transactions</span>
					<span class="stat-value">{status.transactionCount}</span>
				</div>
			</div>

			<div class="features-row">
				{#each Object.entries(status.features) as [key, enabled]}
					<span class="feature-badge" class:enabled>{key}</span>
				{/each}
			</div>
		{/if}

		{#if costs}
			<div class="card">
				<h3 class="card-title">Cost Breakdown ({costs.period})</h3>
				<div class="table-wrap">
					<table class="data-table">
						<thead>
							<tr>
								<th>Category</th>
								<th>Count</th>
								<th>Cost</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Transactions</td>
								<td>{costs.transactions.count}</td>
								<td class="mono">{formatSol(costs.transactions.cost)}</td>
							</tr>
							<tr>
								<td>Commits</td>
								<td>{costs.commits.count}</td>
								<td class="mono">{formatSol(costs.commits.cost)}</td>
							</tr>
							<tr>
								<td>Sessions</td>
								<td>{costs.sessions.count}</td>
								<td class="mono">{formatSol(costs.sessions.cost)}</td>
							</tr>
							<tr class="total-row">
								<td>Total</td>
								<td></td>
								<td class="mono">{formatSol(costs.total)}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		{#if logs.length > 0}
			<div class="card">
				<h3 class="card-title">Recent Logs</h3>
				<div class="table-wrap">
					<table class="data-table">
						<thead>
							<tr>
								<th>Timestamp</th>
								<th>Type</th>
								<th>Message</th>
							</tr>
						</thead>
						<tbody>
							{#each logs as entry}
								<tr>
									<td class="mono">{formatDate(entry.timestamp)}</td>
									<td>
										<span class="log-type">{entry.type}</span>
									</td>
									<td>{entry.message}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else if status}
			<div class="card">
				<h3 class="card-title">Recent Logs</h3>
				<p class="empty-text">No log entries yet.</p>
			</div>
		{/if}
	{/if}
</div>

<style>
	.page {
		max-width: 960px;
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

	.loading-state,
	.empty-state {
		text-align: center;
		padding: 2rem 1rem;
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}

	.empty-text {
		color: var(--color-text-muted, #64748b);
		font-size: 0.875rem;
	}

	.controls-row {
		display: flex;
		align-items: flex-end;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.form-group {
		margin-bottom: 0;
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
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 6px;
		background: var(--color-bg, #f8fafc);
		color: var(--color-text, #1a1a2e);
		outline: none;
	}

	.form-input:focus {
		border-color: var(--color-primary, #8b5cf6);
		box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
	}

	.select-narrow {
		min-width: 180px;
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
	}

	.btn-secondary {
		background: transparent;
		color: var(--color-text-muted, #64748b);
		border: 1px solid var(--color-border, #e2e8f0);
	}

	.btn-secondary:hover {
		background: var(--color-bg, #f8fafc);
	}

	/* Stats grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.stat-card {
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-heading, #0f0f23);
	}

	.features-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin-bottom: 1.5rem;
	}

	.feature-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.6875rem;
		font-weight: 600;
		background: var(--color-bg, #f1f5f9);
		color: var(--color-text-muted, #94a3b8);
		text-transform: capitalize;
	}

	.feature-badge.enabled {
		background: rgba(139, 92, 246, 0.1);
		color: var(--color-primary, #8b5cf6);
	}

	/* Card */
	.card {
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 8px;
		padding: 1.25rem;
		margin-bottom: 1rem;
	}

	.card-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-heading, #0f0f23);
		margin: 0 0 1rem;
	}

	/* Table */
	.table-wrap {
		overflow-x: auto;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	.data-table th {
		text-align: left;
		padding: 0.5rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted, #64748b);
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.data-table td {
		padding: 0.5rem 0.75rem;
		font-size: 0.8125rem;
		color: var(--color-text, #1a1a2e);
		border-bottom: 1px solid var(--color-border, #f1f5f9);
	}

	.data-table tbody tr:last-child td {
		border-bottom: none;
	}

	.total-row td {
		font-weight: 700;
		border-top: 2px solid var(--color-border, #e2e8f0);
	}

	.mono {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.8125rem;
	}

	.log-type {
		display: inline-flex;
		padding: 0.0625rem 0.375rem;
		border-radius: 4px;
		font-size: 0.6875rem;
		font-weight: 600;
		background: var(--color-bg, #f1f5f9);
		color: var(--color-text-muted, #64748b);
		text-transform: uppercase;
	}
</style>
