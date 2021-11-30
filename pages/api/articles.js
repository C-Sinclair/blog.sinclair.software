import { getArticlesDatabase } from '../../lib/notion'

/**
  * @type {import("next").NextApiHandler}
  */
export default (req, res) => {
  // TODO: fetch articles from Notion API
  const articles = await getArticlesDatabase()
  res.status(200).json({ 
    articles
  })
}
