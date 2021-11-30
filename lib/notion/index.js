import { Client } from "@notionhq/client";

export * from './renderer'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const ARTICLES_DATABASE_ID = process.env.ARTICLES_DATABASE_ID

if (!NOTION_TOKEN || !ARTICLES_DATABASE_ID) {
  throw new Error(`Missing NOTION_TOKEN or ARTICLES_DATABASE_ID`)
}

const notion = new Client({
  auth: NOTION_TOKEN,
});

export async function getArticlesDatabase() {
  const res = await notion.databases.query({
    database_id: ARTICLES_DATABASE_ID,
    filter: {
      property: 'Status',
      select: {
        equals: 'Published'
      }
    }
  })
  return res.results
}

/**
  * @param {string} id -- the Notion page id for the article
  */
export async function getArticleById(id) {
  const res = await notion.pages.retrieve({
    page_id: id
  })
  return res
}

/**
  * @param {string} id -- the Notion root block id
  */
export async function getBlocks(id) {
  const res = await notion.blocks.children.list({
    block_id: id,
    page_size: 50,
  })
  const blocks = res.results
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        };
      })
  );
  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children && !block[block.type].children) {
      block[block.type]["children"] = childBlocks.find(
        (x) => x.id === block.id
      )?.children;
    }
    return block;
  });
  return blocksWithChildren
}
