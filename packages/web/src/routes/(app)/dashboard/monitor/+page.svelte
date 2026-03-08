<script lang="ts">
	import '$lib/styles/dashboard.css';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { consoleClient } from '$lib/stores/client';
	import { clientVersion } from '$lib/stores/wallet';
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
			if (projects.length > 0) {
				selectedProject = projects[0].name;
				await loadMonitorData();
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
	/* Page-specific: wider layout */
	.page {
		max-width: 960px;
	}

	.form-group {
		margin-bottom: 0;
	}

	.feature-badge {
		text-transform: capitalize;
	}

	.features-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin-bottom: 1.5rem;
	}

	.total-row td {
		font-weight: 700;
		border-top: 2px solid var(--color-border, #e2e8f0);
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
