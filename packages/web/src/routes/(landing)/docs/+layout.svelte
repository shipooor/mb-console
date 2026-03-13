<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	let sidebarOpen = $state(false);

	const sections = [
		{
			title: 'Get Started',
			items: [
				{ href: '/docs/getting-started', label: 'Getting Started' },
				{ href: '/docs/er-lifecycle', label: 'ER Lifecycle' },
			],
		},
		{
			title: 'Features',
			items: [
				{ href: '/docs/features/gasless', label: 'Gasless Transactions' },
				{ href: '/docs/features/privacy', label: 'Privacy Mode' },
				{ href: '/docs/features/vrf', label: 'VRF (Randomness)' },
				{ href: '/docs/features/cranks', label: 'Cranks' },
				{ href: '/docs/features/oracle', label: 'Oracle' },
			],
		},
		{
			title: 'Reference',
			items: [
				{ href: '/docs/cli', label: 'CLI Reference' },
				{ href: '/docs/mcp', label: 'MCP Reference' },
				{ href: '/docs/api-reference', label: 'API Reference' },
			],
		},
	];

	let currentPath = $derived(page.url.pathname);

	function isActive(href: string): boolean {
		// Exact match or match with trailing slash
		return currentPath === href || currentPath === href + '/';
	}

	function closeSidebar() {
		sidebarOpen = false;
	}
</script>

{#if sidebarOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="sidebar-overlay" onclick={closeSidebar} onkeydown={closeSidebar}></div>
{/if}

<div class="docs-layout">
	<aside class="docs-sidebar" class:open={sidebarOpen}>
		<nav class="sidebar-nav">
			{#each sections as section}
				<div class="sidebar-section">
					<h4 class="sidebar-section-title">{section.title}</h4>
					<ul class="sidebar-list">
						{#each section.items as item}
							<li>
								<a
									href={item.href}
									class="sidebar-link"
									class:active={isActive(item.href)}
									onclick={closeSidebar}
								>
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</aside>

	<div class="docs-main">
		{@render children()}
	</div>
</div>

<button
	class="sidebar-toggle"
	class:open={sidebarOpen}
	onclick={() => (sidebarOpen = !sidebarOpen)}
	aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
>
	<span class="toggle-bar"></span>
	<span class="toggle-bar"></span>
	<span class="toggle-bar"></span>
</button>

<style>
	.docs-layout {
		display: flex;
		max-width: 1100px;
		margin: 0 auto;
		min-height: calc(100vh - 48px - 300px);
	}

	/* -- Sidebar -- */
	.docs-sidebar {
		position: sticky;
		top: 48px;
		width: 240px;
		min-width: 240px;
		height: calc(100vh - 48px);
		overflow-y: auto;
		padding: 1.5rem 0 2rem 1.5rem;
		border-right: 1px solid var(--color-border);
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.sidebar-section-title {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		margin-bottom: 0.5rem;
		padding-left: 0.75rem;
	}

	.sidebar-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.sidebar-link {
		display: block;
		padding: 0.4rem 0.75rem;
		font-size: 0.875rem;
		color: var(--color-text);
		border-radius: var(--radius-md);
		border-left: 2px solid transparent;
		transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
		text-decoration: none;
	}

	.sidebar-link:hover {
		background: rgba(139, 92, 246, 0.06);
		color: var(--color-heading);
	}

	.sidebar-link.active {
		background: rgba(139, 92, 246, 0.12);
		color: var(--color-primary);
		font-weight: 600;
		border-left-color: var(--color-primary);
	}

	/* -- Main content area -- */
	.docs-main {
		flex: 1;
		min-width: 0;
		padding: 0 1.5rem;
	}

	/* -- Mobile toggle button -- */
	.sidebar-toggle {
		display: none;
		position: fixed;
		bottom: 1.25rem;
		right: 1.25rem;
		z-index: 200;
		width: 44px;
		height: 44px;
		border-radius: var(--radius-md);
		background: var(--color-primary);
		border: none;
		cursor: pointer;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		box-shadow: var(--shadow-md);
		transition: background 0.15s ease;
	}

	.sidebar-toggle:hover {
		background: var(--color-primary-hover);
	}

	.toggle-bar {
		display: block;
		width: 20px;
		height: 2px;
		background: #0B0F1A;
		border-radius: 1px;
		transition: transform 0.2s ease, opacity 0.2s ease;
	}

	.sidebar-toggle.open .toggle-bar:nth-child(1) {
		transform: translateY(6px) rotate(45deg);
	}

	.sidebar-toggle.open .toggle-bar:nth-child(2) {
		opacity: 0;
	}

	.sidebar-toggle.open .toggle-bar:nth-child(3) {
		transform: translateY(-6px) rotate(-45deg);
	}

	/* -- Overlay -- */
	.sidebar-overlay {
		display: none;
	}

	/* -- Mobile responsive -- */
	@media (max-width: 768px) {
		.docs-sidebar {
			position: fixed;
			top: 48px;
			left: 0;
			z-index: 150;
			width: 280px;
			min-width: 280px;
			height: calc(100vh - 48px);
			background: var(--color-surface);
			border-right: 1px solid var(--color-border);
			transform: translateX(-100%);
			transition: transform 0.25s ease;
			padding: 1.5rem;
		}

		.docs-sidebar.open {
			transform: translateX(0);
		}

		.sidebar-toggle {
			display: flex;
		}

		.sidebar-overlay {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 140;
			background: rgba(0, 0, 0, 0.5);
		}

		.docs-main {
			padding: 0 1rem;
		}
	}
</style>
