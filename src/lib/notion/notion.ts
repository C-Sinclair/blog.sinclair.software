import dotenv from 'dotenv';
import { Client } from '@notionhq/client';
import type { Article, BlockWithChildren } from '../types';

/**
 * Notion client
 * Should only be run server side!
 * @example
 * export const load = async () => {
 *   const notion = new Notion()
 * }
 */
export class Notion {
	private client: Client;
	private ARTICLES_DATABASE_ID = process.env.ARTICLES_DATABASE_ID as string;

	constructor() {
		dotenv.config();
		const NOTION_TOKEN = process.env.NOTION_TOKEN as string;
		if (!NOTION_TOKEN) {
			throw new Error(`Missing NOTION_TOKEN `);
		}
		if (!this.ARTICLES_DATABASE_ID) {
			throw new Error(`Missing ARTICLES_DATABASE_ID`);
		}
		this.client = new Client({
			auth: NOTION_TOKEN
		});
	}

	async getArticlesDatabase(): Promise<Article[]> {
		const res = await this.client.databases.query({
			database_id: this.ARTICLES_DATABASE_ID,
			filter: {
				property: 'Status',
				select: {
					equals: 'Published'
				}
			},
			sorts: [
				{
					property: 'Created',
					direction: 'descending'
				}
			]
		});
		return res.results as Article[];
	}

	/**
	 * @param id -- the Notion page id for the article
	 */
	async getArticleById(id: string): Promise<Article> {
		const res = await this.client.pages.retrieve({
			page_id: id
		});
		return res as Article;
	}

	/**
	 *
	 * @param path -- the Notion path field (on properties)
	 * @throws if no page found
	 */
	async getArticleByPath(path: string): Promise<Article> {
		const res = await this.client.databases.query({
			database_id: this.ARTICLES_DATABASE_ID,
			filter: {
				property: 'Path',
				text: {
					equals: path
				}
			}
		});
		if (!res || res.results.length > 1) {
			throw new Error(`Could not retrieve article`);
		}
		return res.results[0] as Article;
	}

	/**
	 * @param id -- the Notion root block id
	 */
	async getBlocks(id: string): Promise<BlockWithChildren[]> {
		const res = await this.client.blocks.children.list({
			block_id: id,
			page_size: 50
		});
		const blocks = res.results as BlockWithChildren[];
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
