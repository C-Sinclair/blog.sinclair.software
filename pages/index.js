import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { getArticlesDatabase } from "../lib/notion";

/**
 * @param {Object} props
 * @param {import("../lib/types").Article[]} props.articles
 */
export default function Home({ articles }) {
  return (
    <div className={styles.root}>
      <Head>
        <title>Sinclair Software Blog</title>
        <meta name="description" content="A blog about software" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Welcome to my blog</h1>
        <p>My name is Conor, and I'm a Software Engineer</p>
        <section id="articles">
          <h6>Here's a selection of articles I've written</h6>
          <ol>
            {articles.map((article) => (
              <li key={article.id}>
                <Link href={`/articles/${article.id}`}>
                  <h6>{article.properties.Name.title[0].plain_text}</h6>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}

/**
 * @type {import('next').GetStaticProps}
 */
export async function getStaticProps() {
  const articles = await getArticlesDatabase();
  return {
    props: {
      articles,
    },
    // cache for 1 minute
    revalidate: 60,
  };
}
