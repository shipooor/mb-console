import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			layout: {
				docs: join(__dirname, 'src/lib/components/docs/DocsLayout.svelte')
			}
		})
	],
	kit: {
		adapter: adapter({
			// SPA fallback for dashboard routes (ssr=false)
			// Cloudflare Pages serves 200.html for unmatched routes
			fallback: '200.html'
		}),
		paths: {
			// Use absolute paths so 200.html fallback works from any route depth
			relative: false
		}
	}
};

export default config;
