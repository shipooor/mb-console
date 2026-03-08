import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		// Solana packages reference `global` (Node.js) — alias to browser equivalent
		global: 'globalThis',
	},
	resolve: {
		alias: {
			// Resolve Node.js `buffer` module to the npm polyfill package
			buffer: 'buffer/',
		},
	},
	optimizeDeps: {
		include: ['buffer', '@solana/web3.js', '@magicblock-labs/ephemeral-rollups-sdk'],
	},
});
