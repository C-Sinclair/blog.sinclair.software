import { Notion } from '$lib/notion';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	const notion = new Notion();
	const articles = await notion.getArticlesDatabase();

	return {
		body: articles
	};
};
