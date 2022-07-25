import type { RequestHandler } from "@sveltejs/kit";
import { Notion } from "$lib/notion/notion";

export const GET: RequestHandler = async ({ params, fetch }) => {
  const { path } = params;
  const notion = new Notion();
  const article = await notion.getArticleByPath(path);
  if (!article) {
    throw new Error("No article for that path");
  }
  const blocks = await notion.getBlocks(article.id);
  return {
    body: {
      article,
      blocks,
    },
  };
};
