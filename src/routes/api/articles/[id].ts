import { Notion } from '$lib/notion';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	const { id } = params;
	const notion = new Notion();
	const article = await notion.getArticleById(id);
	const blocks = await notion.getBlocks(id);
	return {
		body: {
			article,
			blocks
		}
	};
};
