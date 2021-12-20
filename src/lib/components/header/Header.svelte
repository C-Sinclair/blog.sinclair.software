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
	<div class='date'>
		<label for="created_time">Created</label>
		<p id="created_time">{createdTime}</p>
	</div>
	<div class='date'>
		<label for="last_edited_time">Last Updated</label>
		<p id="last_edited_time">{lastEditedTime}</p>
	</div>
</header>

<style>
	header {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		padding-bottom: var(--spacing-m);
		max-width: var(--page-max-width);
		margin: 0 auto;
	}

	header > h1 {
		grid-column-start: 1;
		grid-column-end: 3;
		text-align: center;
	}

	.date {
		display: flex;
		padding: var(--spacing-s); 
		position: relative;
		border-radius: var(--spacing-xs);
		border: 1px solid var(--muted-color);
		width: fit-content;
		justify-self: center;
	}

	.date > label {
		position: absolute;
		top: -10px;
		left: 10px;
		background-color: var(--background-color);
	}

	.date > p {
		margin: 0;
		padding: var(--spacing-xxs) var(--spacing-s);
	}
</style>
