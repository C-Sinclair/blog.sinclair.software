// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Notion } from '../src/lib/notion/notion.ts';
import type { Notion as NotionClass } from '../src/lib/notion';
import { join } from 'node:path';
import fs from 'node:fs/promises';
import { cwd } from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

const notion: NotionClass = new Notion();

async function generatePagesJson() {
	const articles = await notion.getArticlesDatabase();
	const paths = [
		'*',
		...articles.map((article) => {
			const path = article.properties.Path.rich_text[0].plain_text;
			return `/articles/${path}`;
		})
	];
	console.log(paths);
	await fs.writeFile(join(cwd(), 'src/routes/articles.json'), JSON.stringify(paths));
}

generatePagesJson();
