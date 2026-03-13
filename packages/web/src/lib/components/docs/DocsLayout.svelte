<script>
	import { onMount } from 'svelte';

	/** @type {{ title?: string, description?: string, children?: import('svelte').Snippet }} */
	let { title = '', description = '', children } = $props();

	const ICON_CLIPBOARD = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>`;
	const ICON_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

	onMount(() => {
		/** @type {Array<{ btn: HTMLButtonElement, handler: () => void }>} */
		const listeners = [];

		const preBlocks = document.querySelectorAll('.docs-content pre[class*="language-"]');

		preBlocks.forEach((pre) => {
			// Extract language name from class (e.g. "language-typescript" -> "typescript")
			const langMatch = pre.className.match(/language-(\w+)/);
			if (langMatch) {
				pre.setAttribute('data-language', langMatch[1]);
			}

			// Create copy button
			const btn = document.createElement('button');
			btn.className = 'copy-btn';
			btn.type = 'button';
			btn.setAttribute('aria-label', 'Copy code');
			btn.innerHTML = ICON_CLIPBOARD;

			/** @type {number | undefined} */
			let resetTimeout;

			const handleClick = () => {
				const code = pre.textContent || '';

				const onSuccess = () => {
					btn.innerHTML = ICON_CHECK;
					btn.classList.add('copied');
					clearTimeout(resetTimeout);
					resetTimeout = window.setTimeout(() => {
						btn.innerHTML = ICON_CLIPBOARD;
						btn.classList.remove('copied');
					}, 2000);
				};

				if (navigator.clipboard && window.isSecureContext) {
					navigator.clipboard.writeText(code).then(onSuccess).catch(() => {
						fallbackCopy(code, onSuccess);
					});
				} else {
					fallbackCopy(code, onSuccess);
				}
			};

			btn.addEventListener('click', handleClick);
			listeners.push({ btn, handler: handleClick });
			pre.appendChild(btn);
		});

		return () => {
			listeners.forEach(({ btn, handler }) => {
				btn.removeEventListener('click', handler);
			});
		};
	});

	/**
	 * Fallback copy using a temporary textarea for older browsers.
	 * @param {string} text
	 * @param {() => void} onSuccess
	 */
	function fallbackCopy(text, onSuccess) {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.left = '-9999px';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();
		try {
			document.execCommand('copy');
			onSuccess();
		} catch {
			// Silently fail — no user-facing error for copy
		}
		document.body.removeChild(textarea);
	}
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
		padding: 2rem 0;
	}

	.docs-content {
		line-height: 1.7;
		color: var(--color-text);
	}

	.docs-content :global(h1) {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--color-heading);
	}

	.docs-content :global(h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2.5rem;
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-heading);
	}

	.docs-content :global(h3) {
		font-size: 1.2rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 0.5rem;
		color: var(--color-heading);
	}

	.docs-content :global(p) {
		margin-bottom: 1rem;
	}

	.docs-content :global(code) {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.875em;
		background: var(--color-code-bg);
		padding: 0.15em 0.4em;
		border-radius: 4px;
		color: var(--color-text);
	}

	.docs-content :global(pre) {
		position: relative;
		background: var(--color-pre-bg);
		color: var(--color-pre-text);
		padding: 1.25rem;
		border-radius: 8px;
		overflow-x: auto;
		margin-bottom: 1.5rem;
		line-height: 1.5;
		border: 1px solid var(--color-border);
	}

	.docs-content :global(pre[data-language]) {
		padding-top: 2.5rem;
	}

	.docs-content :global(pre[data-language])::before {
		content: attr(data-language);
		position: absolute;
		top: 8px;
		left: 12px;
		font-size: 0.7rem;
		font-family: 'Inter', system-ui, sans-serif;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
		opacity: 0.6;
	}

	.docs-content :global(pre code) {
		background: none;
		padding: 0;
		font-size: 0.85rem;
	}

	.docs-content :global(.copy-btn) {
		position: absolute;
		top: 8px;
		right: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		border: none;
		border-radius: 6px;
		background: transparent;
		color: var(--color-text-muted);
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease;
	}

	.docs-content :global(pre:hover .copy-btn) {
		opacity: 1;
	}

	.docs-content :global(.copy-btn:hover) {
		background: rgba(139, 92, 246, 0.15);
		color: var(--color-primary);
	}

	.docs-content :global(.copy-btn.copied) {
		opacity: 1;
		color: var(--color-success);
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
		border-bottom: 1px solid var(--color-border);
	}

	.docs-content :global(th) {
		font-weight: 600;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-muted);
	}

	.docs-content :global(blockquote) {
		border-left: 3px solid var(--color-primary);
		padding-left: 1rem;
		margin: 1.5rem 0;
		color: var(--color-text-muted);
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
		color: var(--color-primary);
		text-decoration: none;
	}

	.docs-content :global(a:hover) {
		text-decoration: underline;
	}

	.docs-content :global(hr) {
		border: none;
		border-top: 1px solid var(--color-border);
		margin: 2rem 0;
	}
</style>
