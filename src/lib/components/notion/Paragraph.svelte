<script lang="ts">
	import type { BlockContent } from '$lib/types';
	import Anchor from './Anchor.svelte';

	export let content: BlockContent;
</script>

<p>
	{#each content?.text ?? [] as { text, annotations }}
		{#if text}
			<Anchor link={text.link}>
				{#if annotations.code}
					<code>{text.content}</code>
				{:else}
					{text.content}
				{/if}
			</Anchor>
		{/if}
	{/each}
</p>
