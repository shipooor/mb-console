<script lang="ts">
	import '$lib/styles/dashboard.css';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { consoleClient } from '$lib/stores/client';
	import { clientVersion } from '$lib/stores/wallet';
	import type { Project, FeatureFlags } from '@magicblock-console/core';

	let projects = $state<Project[]>([]);
	let showCreateForm = $state(false);
	let newName = $state('');
	let newRegion = $state<'us' | 'eu' | 'asia'>('us');
	let newFeatures = $state<Record<keyof FeatureFlags, boolean>>({
		gasless: false,
		privacy: false,
		vrf: false,
		cranks: false,
		oracle: false,
	});
	let loading = $state(true);
	let error = $state<string | null>(null);
	let pendingDelete = $state<string | null>(null);

	let prevVersion = $state(-1);
	$effect(() => {
		const v = $clientVersion;
		if (prevVersion >= 0 && v !== prevVersion) {
			loadProjects();
		}
		prevVersion = v;
	});

	const client = get(consoleClient);

	const featureLabels: Record<keyof FeatureFlags, string> = {
		gasless: 'Gasless',
		privacy: 'Privacy',
		vrf: 'VRF',
		cranks: 'Cranks',
		oracle: 'Oracle',
	};

	onMount(async () => {
		await loadProjects();
	});

	async function loadProjects() {
		loading = true;
		error = null;
		try {
			projects = await client.projects.list();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	async function createProject() {
		if (!newName.trim()) {
			error = 'Project name is required';
			return;
		}
		error = null;
		try {
			await client.projects.create({
				name: newName.trim(),
				region: newRegion,
				features: { ...newFeatures },
			});
			showCreateForm = false;
			newName = '';
			newRegion = 'us';
			newFeatures = {
				gasless: false,
				privacy: false,
				vrf: false,
				cranks: false,
				oracle: false,
			};
			await loadProjects();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	function confirmDelete(name: string) {
		pendingDelete = name;
	}

	function cancelDelete() {
		pendingDelete = null;
	}

	async function executeDelete() {
		if (!pendingDelete) return;
		const name = pendingDelete;
		pendingDelete = null;
		error = null;
		try {
			await client.projects.delete(name);
			await loadProjects();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}

	function enabledFeatures(features: FeatureFlags): (keyof FeatureFlags)[] {
		return (Object.keys(features) as (keyof FeatureFlags)[]).filter(
			(k) => features[k],
		);
	}
</script>

<svelte:head>
	<title>Projects — MagicBlock Console</title>
</svelte:head>

<div class="page">
	<div class="page-header">
		<h2 class="page-title">Projects</h2>
		<button class="btn btn-primary" onclick={() => (showCreateForm = !showCreateForm)}>
			{showCreateForm ? 'Cancel' : 'New Project'}
		</button>
	</div>

	{#if error}
		<div class="alert alert-error">{error}</div>
	{/if}

	{#if pendingDelete}
		<div class="alert alert-confirm">
			Delete project "{pendingDelete}"? This action cannot be undone.
			<span class="confirm-actions">
				<button class="btn btn-danger-text" onclick={executeDelete}>Delete</button>
				<button class="btn btn-secondary btn-sm" onclick={cancelDelete}>Cancel</button>
			</span>
		</div>
	{/if}

	{#if showCreateForm}
		<div class="card create-form">
			<h3 class="form-title">Create New Project</h3>
			<form onsubmit={(e) => { e.preventDefault(); createProject(); }}>
				<div class="form-group">
					<label class="form-label" for="project-name">Project Name</label>
					<input
						id="project-name"
						class="form-input"
						type="text"
						bind:value={newName}
						placeholder="my-game"
						required
					/>
				</div>

				<div class="form-group">
					<label class="form-label" for="project-region">Region</label>
					<select id="project-region" class="form-input" bind:value={newRegion}>
						<option value="us">US</option>
						<option value="eu">EU</option>
						<option value="asia">Asia</option>
					</select>
				</div>

				<div class="form-group">
					<span class="form-label">Features</span>
					<div class="feature-checkboxes">
						{#each Object.entries(featureLabels) as [key, label]}
							<label class="checkbox-label">
								<input type="checkbox" bind:checked={newFeatures[key as keyof FeatureFlags]} />
								<span>{label}</span>
							</label>
						{/each}
					</div>
				</div>

				<div class="form-actions">
					<button type="button" class="btn btn-secondary" onclick={() => (showCreateForm = false)}>
						Cancel
					</button>
					<button type="submit" class="btn btn-primary">Create Project</button>
				</div>
			</form>
		</div>
	{/if}

	{#if loading}
		<div class="loading-state">Loading projects...</div>
	{:else if projects.length === 0}
		<div class="empty-state">
			<div class="empty-icon">P</div>
			<h3 class="empty-title">No projects yet</h3>
			<p class="empty-text">Create your first project to get started with Ephemeral Rollups.</p>
			<button class="btn btn-primary" onclick={() => (showCreateForm = true)}>
				Create Project
			</button>
		</div>
	{:else}
		<div class="projects-grid">
			{#each projects as project}
				<div class="card project-card">
					<div class="project-header">
						<h3 class="project-name">{project.name}</h3>
						<span class="region-badge">{project.region.toUpperCase()}</span>
					</div>

					<div class="project-features">
						{#each Object.entries(featureLabels) as [key, label]}
							<span
								class="feature-badge"
								class:enabled={project.features[key as keyof FeatureFlags]}
							>
								{label}
							</span>
						{/each}
					</div>

					<div class="project-footer">
						<span class="project-date">Created {formatDate(project.createdAt)}</span>
						<button
							class="btn btn-danger-text"
							onclick={() => confirmDelete(project.name)}
						>
							Delete
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Page-specific: override loading/empty padding */
	.loading-state {
		padding: 3rem 1rem;
	}

	.empty-state {
		padding: 3rem 1rem;
	}

	.empty-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: rgba(6, 182, 212, 0.12);
		color: var(--color-primary);
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.empty-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-heading);
		margin: 0 0 0.5rem;
	}

	.empty-text {
		margin-bottom: 1.25rem;
	}

	/* Create form */
	.create-form {
		margin-bottom: 1.5rem;
	}

	.form-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-heading);
		margin: 0 0 1rem;
	}

	.feature-checkboxes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		color: var(--color-text);
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		accent-color: var(--color-primary);
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1.25rem;
	}

	/* Confirmation inline alert */
	.alert-confirm {
		background: rgba(245, 158, 11, 0.1);
		color: #FBBF24;
		border: 1px solid rgba(245, 158, 11, 0.3);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.confirm-actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	/* Projects grid */
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1rem;
	}

	.project-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.project-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.project-name {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-heading);
		margin: 0;
	}

	.region-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		background: rgba(59, 130, 246, 0.1);
		color: #3b82f6;
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.05em;
	}

	.project-features {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.project-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 0.5rem;
		border-top: 1px solid var(--color-border);
	}

	.project-date {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}
</style>
