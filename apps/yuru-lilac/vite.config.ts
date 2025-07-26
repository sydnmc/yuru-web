import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 1415,
		fs: {
      		allow: [
        		searchForWorkspaceRoot(process.cwd()),
        		'./assets/Kyokasho.ttf',
      		],
    	},
	}
});
