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

<h1>Welcome to my blog</h1>
<p>My name is Conor, and I'm a Software Engineer</p>
<section id="articles">
	<h6>Here's a selection of articles I've written</h6>
	<ol>
		{#each articles as article}
			<li>
				<a href={`/articles/${article.id}`}>
					<h6>{article.properties.Name.title[0].plain_text}</h6>
				</a>
			</li>
		{/each}
	</ol>
</section>
