import preprocess from 'svelte-preprocess';
import path from 'path';
import adapter from '@sveltejs/adapter-static';

const config = {
	preprocess: preprocess(),

	resolve: {
		alias: {
			$utils: path.resolve('src/utils/'),
		},
	},

	kit: {
		adapter: adapter(),
		vite: {
			define: {
				'process.env.BROWSER': true
			},
			optimizeDeps: {
				include: ['@project-serum/anchor'],
			},
		}
	}
};

export default config;
