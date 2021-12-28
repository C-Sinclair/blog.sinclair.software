<script lang="ts">
	import { format } from "fecha";
	import type { Article } from '$lib/types';

	export let article: Article

	/**
	 * @param {string} time -- raw date string
	 * @returns {string} pretty formatted date string
	 */
	function formatDate(time: string): string {
		return format(new Date(time), "dddd MMMM Do, YYYY");
	}

	const title = article.properties.Name.title[0].plain_text;
	const createdTime = formatDate(article.created_time);
	const lastEditedTime = formatDate(article.last_edited_time);
</script>

<header>
	<h1>{title}</h1>
	{#if article.icon?.emoji}
		<span class='icon'>{article.icon.emoji}</span>
	{/if}
	<p 
		id="created_time"
		class='date' 
		title='Created'
	>
		{createdTime}
	</p>
	<p 
		id="last_edited_time"
		class='date' 
		title='Last Updated'
	>
		{lastEditedTime}
	</p>
</header>

<style>
	header {
		max-width: var(--page-max-width);		
		width: 100%;
		padding: var(--spacing-s) 0;
		margin: 0 auto;
		position: relative;
		display: flex;
		flex-direction: column;
	}
	header .icon {
		font-size: 4em;
    width: fit-content;
    height: fit-content;
		align-self: center;
	}
	header h1 {
		grid-column-start: 1;
		grid-column-end: 3;
		text-align: center;
		margin-bottom: var(--spacing-xs);
	}
	.date {
		padding: var(--spacing-s) 0; 
		position: absolute;
		width: fit-content;
		color: var(--gray-soft);
		font-size: 0.75em;
		margin: 0;
		bottom: 0;
	}
	#created_time {
		left: 0;
	}
	#last_edited_time {
		right: 0;
	}
	@media only screen and (max-width: 600px) {
		header .icon {
			padding-bottom: var(--spacing-xxs);
		} 
	}
</style>
