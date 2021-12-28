import type { Article, ArticleTag } from '$lib/types';

export function getTags(article: Article): ArticleTag[] {
	const tags = article.properties.Tags.multi_select;
	const langs = article.properties.Language.multi_select;
	return [...langs, ...tags];
}
