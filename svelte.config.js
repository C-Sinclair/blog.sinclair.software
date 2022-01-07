import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config();

const pkg = JSON.parse(fs.readFileSync('./package.json'));
const entries = JSON.parse(fs.readFileSync('./src/routes/articles.json'));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		prerender: {
			crawl: true,
			enabled: true,
			entries
		},

		vite: {
			ssr: {
				noExternal: Object.keys(pkg.dependencies || {})
			}
		},

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};

export default config;
