import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
	plugins: [sveltekit(), nodePolyfills({ include: ['fs'] })],
	server: {
		fs: {
		  // Allow serving files from one level up to the project root
		  allow: ['..'],
		},
	  },
	ssr: {
		noExternal: ['@popperjs/core']
	}

});
