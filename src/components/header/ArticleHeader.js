import { useMemo } from "react";
import { format } from "fecha";
import styles from "../styles/Article.module.css";

/**
 * @param {Object} props
 * @param {Article} props.article
 */
export function ArticleHeader({ article }) {
  const { articleTitle, createdTime, lastEditedTime } = useMemo(() => {
    const title = article.properties.Name.title[0].plain_text;
    return {
      articleTitle: title,
      createdTime: formatDate(article.created_time),
      lastEditedTime: formatDate(article.last_edited_time),
    };
  }, [article]);
  return (
    <header className={styles.articleHeader}>
      <h1>{articleTitle}</h1>
      <div className={styles.date}>
        <label htmlFor="created_time">Created</label>
        <p id="created_time">{createdTime}</p>
      </div>
      <div className={styles.date}>
        <label htmlFor="last_edited_time">Last Updated</label>
        <p id="last_edited_time">{lastEditedTime}</p>
      </div>
    </header>
  );
}

/**
 * @param {string} time -- raw date string
 * @returns {string} pretty formatted date string
 */
function formatDate(time) {
  return format(new Date(time), "dddd MMMM Do, YYYY");
}
