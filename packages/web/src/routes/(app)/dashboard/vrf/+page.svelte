<script lang="ts">
	import '$lib/styles/dashboard.css';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { consoleClient } from '$lib/stores/client';
	import { clientVersion } from '$lib/stores/wallet';
	import type { Project, VrfResult } from '@magicblock-console/core';

	let projects = $state<Project[]>([]);
	let selectedProject = $state('');
	let loading = $state(true);
	let requesting = $state(false);
	let error = $state<string | null>(null);
	let lastResult = $state<VrfResult | null>(null);
	let history = $state<Array<VrfResult & { timestamp: Date }>>([]);

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

		<div class="info-note">
			<strong>Always simulated.</strong> Randomness is generated using <code>crypto.getRandomValues</code> (cryptographically secure) but the proof is not verifiable on-chain. On-chain VRF integration with MagicBlock is planned for a future release.
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
	/* Page-specific: VRF result display */
	.form-group {
		margin-bottom: 0;
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
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.result-value {
		font-size: 0.875rem;
		color: var(--color-text);
	}

	.wrap {
		word-break: break-all;
	}

	.info-note code {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		background: var(--color-border);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
	}
</style>
