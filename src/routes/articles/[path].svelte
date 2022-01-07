<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { Notion } from '$lib/notion/notion';

	export const load: Load = async ({ params, fetch }) => {
		const { path } = params;
		const notion = new Notion();
		const article = await notion.getArticleByPath(path);
		if (!article) {
			throw new Error('No article for that path');
		}
		const blocks = await notion.getBlocks(article.id);
		return {
			props: {
				article,
				blocks
			}
		};
	};
</script>

<script lang="ts">
	import type { BlockType, Article } from '$lib/types';
	import Header from '$lib/components/header/Header.svelte';
	import Block from '$lib/components/notion/Block.svelte';
	import Tags from '$lib/components/tags/Tags.svelte';
	import { getTags } from '$lib/components/tags/util';

	export let article: Article;
	export let blocks: BlockType[];

	let tags = getTags(article);
</script>

<svelte:head>
	<title>{article.properties.Name.title[0].plain_text}</title>
</svelte:head>

<Header {article} />

<section id="tags">
	<Tags {tags} />
</section>

<article>
	{#each blocks as block}
		<Block {block} />
	{/each}
</article>

<style>
	article,
	section {
		max-width: var(--page-max-width);
		width: 100%;
		margin: 0 auto;
	}
</style>
