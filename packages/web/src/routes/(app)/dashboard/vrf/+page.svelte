<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { consoleClient } from '$lib/stores/client';
	import type { Project, VrfResult } from '@magicblock-console/core';

	let projects = $state<Project[]>([]);
	let selectedProject = $state('');
	let loading = $state(true);
	let requesting = $state(false);
	let error = $state<string | null>(null);
	let lastResult = $state<VrfResult | null>(null);
	let history = $state<Array<VrfResult & { timestamp: Date }>>([]);

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

	async function requestRandomness() {
		if (!selectedProject) {
			error = 'Select a project first';
			return;
		}
		error = null;
		requesting = true;
		try {
			const result = await client.vrf.request({ project: selectedProject });
			lastResult = result;
			history = [{ ...result, timestamp: new Date() }, ...history].slice(0, 20);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			requesting = false;
		}
	}

	function toHex(bytes: Uint8Array): string {
		return Array.from(bytes)
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}

	function formatTime(date: Date): string {
		return new Date(date).toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	}
</script>

<svelte:head>
	<title>VRF — MagicBlock Console</title>
</svelte:head>

<div class="page">
	<div class="page-header">
		<h2 class="page-title">Verifiable Random Function</h2>
	</div>

	{#if error}
		<div class="alert alert-error">{error}</div>
	{/if}

	{#if loading}
		<div class="loading-state">Loading...</div>
	{:else if projects.length === 0}
		<div class="empty-state">
			<p class="empty-text">Create a project with VRF enabled to generate randomness.</p>
		</div>
	{:else}
		<div class="controls-row">
			<div class="form-group">
				<label class="form-label" for="vrf-project">Project</label>
				<select id="vrf-project" class="form-input select-narrow" bind:value={selectedProject}>
					{#each projects as p}
						<option value={p.name}>{p.name}</option>
					{/each}
				</select>
			</div>
			<button
				class="btn btn-primary"
				onclick={requestRandomness}
				disabled={requesting}
			>
				{requesting ? 'Requesting...' : 'Request Randomness'}
			</button>
		</div>

		{#if lastResult}
			<div class="card result-card">
				<h3 class="card-title">VRF Result</h3>
				<div class="result-grid">
					<div class="result-item">
						<span class="result-label">Request ID</span>
						<span class="result-value mono">{lastResult.requestId}</span>
					</div>
					<div class="result-item">
						<span class="result-label">Randomness (hex)</span>
						<span class="result-value mono wrap">{toHex(lastResult.randomness)}</span>
					</div>
					<div class="result-item">
						<span class="result-label">Proof</span>
						<span class="result-value mono wrap">{lastResult.proof.slice(0, 64)}...</span>
					</div>
					<div class="result-item">
						<span class="result-label">Latency</span>
						<span class="result-value">{lastResult.latencyMs}ms</span>
					</div>
				</div>
			</div>
		{/if}

		{#if history.length > 0}
			<div class="card">
				<h3 class="card-title">Request History</h3>
				<div class="table-wrap">
					<table class="data-table">
						<thead>
							<tr>
								<th>Time</th>
								<th>Request ID</th>
								<th>Randomness</th>
								<th>Latency</th>
							</tr>
						</thead>
						<tbody>
							{#each history as entry}
								<tr>
									<td>{formatTime(entry.timestamp)}</td>
									<td class="mono">{entry.requestId}</td>
									<td class="mono">{toHex(entry.randomness).slice(0, 16)}...</td>
									<td>{entry.latencyMs}ms</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.page {
		max-width: 900px;
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

	.result-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.result-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.result-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.result-value {
		font-size: 0.875rem;
		color: var(--color-text, #1a1a2e);
	}

	.mono {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.8125rem;
	}

	.wrap {
		word-break: break-all;
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
</style>
