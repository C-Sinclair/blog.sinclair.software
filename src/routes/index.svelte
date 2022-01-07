<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Article } from '$lib/types';

	export const load: Load = async () => {
		const notion = new Notion();
		const articles = await notion.getArticlesDatabase();
		return {
			props: {
				articles
			}
		};
	};
</script>

<script lang="ts">
	import Tags from '$lib/components/tags/Tags.svelte';
	import { getTags } from '$lib/components/tags/util';
	import { Notion } from '$lib/notion';

	export let articles: Article[];
</script>

<svelte:head>
	<title>C Sinclair => Blog</title>
	<meta name="description" content="A blog about software" />
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<header>
	<h1>Welcome to my blog</h1>
	<img id="me" src="/me.jpeg" alt="My handsome face" />
	<blockquote>My name is Conor, and I'm a Software Engineer</blockquote>
	<!-- TODO: image of me waving, on hover change to other image -->
</header>

<section id="prelude">
	<p>
		I see this blog as being a way to get thoughts and ideas out of my brain, and to (hopefully)
		help some other developer who is in a similar position.
	</p>
	<p>
		It is my plan for this to be one of the pillars of my own learning. As you don't ever really
		know something until you've taught that knowledge to someone else.
	</p>
	<p>
		Sharing knowledge is the absolute most powerful feature of the web, and I want to do my small
		part in it.
	</p>
</section>

<section id="articles">
	<h1>Articles</h1>
	<p>Here's a selection of articles I've written</p>
	<ol>
		{#each articles as article}
			<li>
				<a href={`/articles/${article.properties.Path.rich_text[0].text.content}`}>
					{#if article.icon?.emoji}
						<span>{article.icon?.emoji}</span>
					{/if}
					<div class="text">
						<h4>{article.properties.Name.title[0].plain_text}</h4>
						<Tags tags={getTags(article)} />
					</div>
				</a>
			</li>
		{/each}
	</ol>
</section>

<style>
	header {
		padding: var(--spacing-s) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	img#me {
		border-radius: 100%;
		width: 7em;
		margin: var(--spacing-m) 0 var(--spacing-s);
	}
	blockquote {
		border: 1px solid var(--primary-soft-color);
		padding: var(--spacing-xs) var(--spacing-s);
		border-radius: var(--spacing-xxs);
		margin: var(--spacing-s) 0 0 0;
	}
	section {
		margin-bottom: var(--spacing-m);
		max-width: var(--page-max-width);
		width: 100%;
		align-self: center;
	}
	li {
		margin-bottom: var(--spacing-s);
		border: 1px solid var(--primary-soft-color);
		border-radius: var(--spacing-xxs);
		transition: transform 0.2s ease-in-out;
	}
	li:hover {
		transform: scale(1.005);
		background-color: var(--selection-color);
	}
	li a {
		display: flex;
		align-items: center;
		padding: 0 var(--spacing-m);
	}
	li span {
		width: 1em;
		margin-right: var(--spacing-s);
	}
	.text h4 {
		margin: var(--spacing-s) 0;
	}
</style>
