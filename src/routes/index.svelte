<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Article } from '$lib/types';
	
	export const load: Load = async ({ fetch }) => {
		const res = await fetch(`/api/articles`)
		if (!res.ok) {
			throw new Error(`Api request failed`)
		}
		const articles = await res.json()
		return {
			props: {
				articles
			}
		}
	}
</script>

<script lang="ts">
	export let articles: Article[]
</script>

<svelte:head>    
	<title>Sinclair Software Blog</title>
	<meta name="description" content="A blog about software" />
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<header>
	<h1>Welcome to my blog</h1>
	<blockquote>My name is Conor, and I'm a Software Engineer</blockquote>
	<!-- TODO: image of me waving, on hover change to other image -->
</header>

<section id='prelude'>
	<p>I see this blog as being a way to get thoughts and ideas out of my brain, and to (hopefully) help some other developer who is in a similar position.</p>
	<p>It is my plan for this to be one of the pillars of my own learning. As you don't ever really know something until you've taught that knowledge to someone else.</p>
	<p>Sharing knowledge is the absolute most powerful feature of the web, and I want to do my small part in it.</p>
</section>

<section id="articles">
	<h1>Articles</h1>
	<p>Here's a selection of articles I've written</p>
	<ol>
		{#each articles as article}
			<li>
				<a href={`/articles/${article.id}`}>
					{#if article.icon?.emoji}
						<i>{article.icon?.emoji}</i>
					{/if}
					<h4>{article.properties.Name.title[0].plain_text}</h4>
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
	blockquote {
		background-color: var(--primary-soft-color);
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
	li i {
		margin-right: var(--spacing-s);
	}
</style>