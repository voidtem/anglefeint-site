// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://anglefeint.com',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => {
				// Exclude /en/ — it redirects to / (root is canonical for English home)
				const path = new URL(page).pathname;
				return path !== '/en/' && path !== '/en';
			},
		}),
	],
});
