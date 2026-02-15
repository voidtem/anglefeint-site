import type { CollectionEntry } from 'astro:content';
import type { Locale } from './config';

export const BLOG_PAGE_SIZE = 9;

export function postsForLocale(posts: CollectionEntry<'blog'>[], locale: Locale): CollectionEntry<'blog'>[] {
	return posts
		.filter((post) => post.id.startsWith(`${locale}/`))
		sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

