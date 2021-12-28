<script lang="ts">
	import type { ArticleTag } from '$lib/types';

	import Tag from './Tag.svelte';

	export let tags: ArticleTag[];
</script>

<ul>
	{#each tags as tag}
		<Tag {tag} />
	{/each}
</ul>

<style>
	ul {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: var(--spacing-s);
	}
</style>
