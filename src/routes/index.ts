import type { RequestHandler } from "@sveltejs/kit";
import { Notion } from "$lib/notion";

export const GET: RequestHandler = async () => {
  const notion = new Notion();
  const articles = await notion.getArticlesDatabase();
  return {
    body: {
      articles,
    },
  };
};
