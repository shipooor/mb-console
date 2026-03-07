<script lang="ts">
	import '$lib/styles/dashboard.css';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { consoleClient } from '$lib/stores/client';
	import type { Project, PriceFeed } from '@magicblock-console/core';

	let projects = $state<Project[]>([]);
	let selectedProject = $state('');
	let selectedFeed = $state('SOL/USD');
	let loading = $state(true);
	let fetching = $state(false);
	let error = $state<string | null>(null);
	let priceResult = $state<PriceFeed | null>(null);
	let history = $state<PriceFeed[]>([]);

	const feeds = ['SOL/USD', 'BTC/USD', 'ETH/USD', 'USDC/USD'];
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

	async function getPrice() {
		if (!selectedProject) {
			error = 'Select a project first';
			return;
		}
		error = null;
		fetching = true;
		try {
			const result = await client.oracle.getPrice({
				project: selectedProject,
				feed: selectedFeed,
			});
			priceResult = result;
			history = [result, ...history].slice(0, 20);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			fetching = false;
		}
	}

	function formatPrice(price: number): string {
		if (price >= 1000) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		if (price >= 1) return '$' + price.toFixed(4);
		return '$' + price.toFixed(6);
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
	<title>Oracle — MagicBlock Console</title>
</svelte:head>

<div class="page">
	<div class="page-header">
		<h2 class="page-title">Oracle Price Feeds</h2>
	</div>

	{#if error}
		<div class="alert alert-error">{error}</div>
	{/if}

	{#if loading}
		<div class="loading-state">Loading...</div>
	{:else if projects.length === 0}
		<div class="empty-state">
			<p class="empty-text">Create a project with Oracle enabled first.</p>
		</div>
	{:else}
		<div class="controls-row">
			<div class="form-group">
				<label class="form-label" for="oracle-project">Project</label>
				<select id="oracle-project" class="form-input select-narrow" bind:value={selectedProject}>
					{#each projects as p}
						<option value={p.name}>{p.name}</option>
					{/each}
				</select>
			</div>
			<div class="form-group">
				<label class="form-label" for="oracle-feed">Feed</label>
				<select id="oracle-feed" class="form-input select-narrow" bind:value={selectedFeed}>
					{#each feeds as feed}
						<option value={feed}>{feed}</option>
					{/each}
				</select>
			</div>
			<button class="btn btn-primary" onclick={getPrice} disabled={fetching}>
				{fetching ? 'Fetching...' : 'Get Price'}
			</button>
		</div>

		{#if priceResult}
			<div class="card price-card">
				<div class="price-header">
					<span class="price-feed">{priceResult.feed}</span>
					<span class="price-value">{formatPrice(priceResult.price)}</span>
				</div>
				<div class="price-details">
					<div class="detail-item">
						<span class="detail-label">Confidence</span>
						<span class="detail-value">{priceResult.confidence}</span>
					</div>
					<div class="detail-item">
						<span class="detail-label">Slot</span>
						<span class="detail-value mono">{priceResult.slot}</span>
					</div>
					<div class="detail-item">
						<span class="detail-label">Timestamp</span>
						<span class="detail-value">{formatTime(priceResult.timestamp)}</span>
					</div>
				</div>
			</div>
		{/if}

		{#if history.length > 0}
			<div class="card">
				<h3 class="card-title">Price History</h3>
				<div class="table-wrap">
					<table class="data-table">
						<thead>
							<tr>
								<th>Time</th>
								<th>Feed</th>
								<th>Price</th>
								<th>Confidence</th>
								<th>Slot</th>
							</tr>
						</thead>
						<tbody>
							{#each history as entry}
								<tr>
									<td>{formatTime(entry.timestamp)}</td>
									<td>{entry.feed}</td>
									<td class="mono">{formatPrice(entry.price)}</td>
									<td>{entry.confidence}</td>
									<td class="mono">{entry.slot}</td>
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
	/* Page-specific: controls wrap */
	.controls-row {
		flex-wrap: wrap;
	}

	.form-group {
		margin-bottom: 0;
	}

	.select-narrow {
		min-width: 160px;
	}

	/* Price card */
	.price-card {
		text-align: center;
	}

	.price-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		margin-bottom: 1rem;
	}

	.price-feed {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
	}

	.price-value {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-heading, #0f0f23);
		font-family: 'JetBrains Mono', monospace;
	}

	.price-details {
		display: flex;
		justify-content: center;
		gap: 2rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border, #e2e8f0);
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.125rem;
	}

	.detail-label {
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--color-text-muted, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.detail-value {
		font-size: 0.875rem;
		color: var(--color-text, #1a1a2e);
	}
</style>
