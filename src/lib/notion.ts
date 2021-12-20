import { Client } from '@notionhq/client';
import type { SupportedFetch } from '@notionhq/client/build/src/fetch-types';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const ARTICLES_DATABASE_ID = process.env.ARTICLES_DATABASE_ID;

if (!NOTION_TOKEN || !ARTICLES_DATABASE_ID) {
	throw new Error(`Missing NOTION_TOKEN or ARTICLES_DATABASE_ID`);
}

/**
 * SvelteKit compatible Notion client
 * @example
 * export const load = async ({ fetch }) => {
 *   const notion = new Notion(fetch)
 * }
 */
export class Notion {
	private client: Client;

	constructor(fetch?: SupportedFetch) {
		this.client = new Client({
			auth: NOTION_TOKEN,
			fetch
		});
	}

	async getArticlesDatabase() {
		const res = await this.client.databases.query({
			database_id: ARTICLES_DATABASE_ID,
			filter: {
				property: 'Status',
				select: {
					equals: 'Published'
				}
			}
		});
		return res.results;
	}

	/**
	 * @param id -- the Notion page id for the article
	 */
	async getArticleById(id: string) {
		const res = await this.client.pages.retrieve({
			page_id: id
		});
		return res;
	}

	/**
	 * @param id -- the Notion root block id
	 */
	async getBlocks(id: string) {
		const res = await this.client.blocks.children.list({
			block_id: id,
			page_size: 50
		});
		const blocks = res.results;
		const childBlocks = await Promise.all(
			blocks
				.filter((block) => block.has_children)
				.map(async (block) => {
					return {
						id: block.id,
						children: await this.getBlocks(block.id)
					};
				})
		);
		const blocksWithChildren = blocks.map((block) => {
			// Add child blocks if the block should contain children but none exists
			if (block.has_children && !block[block.type].children) {
				block[block.type]['children'] = childBlocks.find((x) => x.id === block.id)?.children;
			}
			return block;
		});
		return blocksWithChildren;
	}
}
