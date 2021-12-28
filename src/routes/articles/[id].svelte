<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page, fetch }) => {
		const id = page.params?.id;
		if (!id) {
			throw new Error('missing id');
		}
		const res = await fetch(`/api/articles/${id}`);
		if (!res.ok) {
			throw new Error(`Api request failed`);
		}
		const { article, blocks } = await res.json();
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

	export let article: Article;
	export let blocks: BlockType[];

	let tags = article.properties.Tags.multi_select;
	let langs = article.properties.Language.multi_select;
</script>

<svelte:head>
	<title>{article.properties.Name.title[0].plain_text}</title>
</svelte:head>

<Header {article} />

<section id="tags">
	<ul>
		{#each [...langs, ...tags] as tag}
			<li style={`--colour: ${tag.color}`}>
				{tag.name}
			</li>
		{/each}
	</ul>
</section>

<article>
	{#each blocks as block}
		<Block {block} />
	{/each}
</article>

<style>
	section#tags ul {
		display: flex;
		flex-wrap: wrap;
	}
	section#tags li {
		background-color: var(--colour);
		padding: calc(var(--spacing-xs) / 2) var(--spacing-xs);
		margin-right: var(--spacing-xs);
		border-radius: var(--spacing-xs);
	}
	article,
	section {
		max-width: var(--page-max-width);
		width: 100%;
		margin: 0 auto;
	}
</style>
