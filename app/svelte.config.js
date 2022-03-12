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
	}
};

export default config;
