<script>
	/** @type {{ title?: string, description?: string, section?: string, children?: import('svelte').Snippet }} */
	let { title = '', description = '', section = '', children } = $props();
</script>

<svelte:head>
	{#if title}
		<title>{title} — MagicBlock Console Docs</title>
	{/if}
	{#if description}
		<meta name="description" content={description} />
	{/if}
</svelte:head>

<div class="docs-page">
	<article class="docs-content">
		{#if children}
			{@render children()}
		{/if}
	</article>
</div>

<style>
	.docs-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.docs-content {
		line-height: 1.7;
		color: var(--color-text, #1a1a2e);
	}

	.docs-content :global(h1) {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--color-heading, #0f0f23);
	}

	.docs-content :global(h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2.5rem;
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.docs-content :global(h3) {
		font-size: 1.2rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 0.5rem;
	}

	.docs-content :global(p) {
		margin-bottom: 1rem;
	}

	.docs-content :global(code) {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.875em;
		background: var(--color-code-bg, #f1f5f9);
		padding: 0.15em 0.4em;
		border-radius: 4px;
	}

	.docs-content :global(pre) {
		background: var(--color-pre-bg, #0f172a);
		color: var(--color-pre-text, #e2e8f0);
		padding: 1.25rem;
		border-radius: 8px;
		overflow-x: auto;
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}

	.docs-content :global(pre code) {
		background: none;
		padding: 0;
		font-size: 0.85rem;
	}

	.docs-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
	}

	.docs-content :global(th),
	.docs-content :global(td) {
		text-align: left;
		padding: 0.625rem 1rem;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.docs-content :global(th) {
		font-weight: 600;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted, #64748b);
	}

	.docs-content :global(blockquote) {
		border-left: 3px solid var(--color-primary, #8b5cf6);
		padding-left: 1rem;
		margin: 1.5rem 0;
		color: var(--color-text-muted, #64748b);
	}

	.docs-content :global(ul),
	.docs-content :global(ol) {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	.docs-content :global(li) {
		margin-bottom: 0.375rem;
	}

	.docs-content :global(a) {
		color: var(--color-primary, #8b5cf6);
		text-decoration: none;
	}

	.docs-content :global(a:hover) {
		text-decoration: underline;
	}

	.docs-content :global(hr) {
		border: none;
		border-top: 1px solid var(--color-border, #e2e8f0);
		margin: 2rem 0;
	}
</style>
