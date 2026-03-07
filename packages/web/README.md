# @magicblock-console/web

Web interface for MagicBlock Console. Built with SvelteKit 2 and Svelte 5.

## Development

```bash
npm run dev -w packages/web
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build -w packages/web
```

## Structure

- `src/routes/(landing)/` — SSR landing page and documentation (prerendered for SEO)
- `src/routes/(app)/dashboard/` — SPA dashboard (client-side only)
- `src/lib/components/` — Reusable Svelte components
- `src/lib/stores/` — Svelte stores for state management
- `src/lib/utils/` — Utility functions
