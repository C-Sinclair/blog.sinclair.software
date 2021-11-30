/**
 * @typedef {import('../../lib/types').Article} Article
 * @typedef {import('../../lib/types').Block} Block
 */
import Head from "next/head";
import { Fragment } from "react";
import {
  getArticlesDatabase,
  getArticleById,
  getBlocks,
} from "../../lib/notion";
import { renderBlock } from "../../lib/notion/renderer";
import styles from "../../styles/Article.module.css";
import { ArticleHeader } from "../../components/ArticleHeader";

/**
 * @param {Object} props
 * @param {Article} props.article
 * @param {Block[]} props.blocks
 */
function Article({ article, blocks }) {
  return (
    <div className={styles.article}>
      <Head>
        <title>{article.properties.Name.title[0].plain_text}</title>
      </Head>
      <main>
        <ArticleHeader article={article} />
        <section id="tags">
          <ul>
            {article.properties.Tags.multi_select.map((tag) => (
              <li key={tag.id} className={tag.color}>
                {tag.name}
              </li>
            ))}
          </ul>
        </section>
        <article>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </article>
      </main>
    </div>
  );
}

export default Article;

/**
 * @type {import('next').GetStaticProps}
 */
export async function getStaticProps(context) {
  const id = context.params?.id;
  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const article = await getArticleById(id);
  const blocks = await getBlocks(id);
  return {
    props: {
      article,
      blocks,
    },
    revalidate: 60,
  };
}

/**
 * Generate all the paths of articles using their id
 * Uses ISR to server render and then cache on the first request
 * @type {import('next').GetStaticPaths}
 */
export async function getStaticPaths() {
  const articles = await getArticlesDatabase();
  const paths = articles.map((page) => ({ params: { id: page.id } }));
  return {
    paths,
    fallback: "blocking",
  };
}
