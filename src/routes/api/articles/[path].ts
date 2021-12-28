import { Notion } from '$lib/notion';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	const { path } = params;
	const notion = new Notion();
	const article = await notion.getArticleByPath(path);
	if (!article) {
		return { body: {}, status: 404 };
	}
	const blocks = await notion.getBlocks(article.id);
	return {
		body: {
			article,
			blocks
		}
	};
};
