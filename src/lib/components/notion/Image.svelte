<script lang="ts">
	import type { BlockContent, ImageBlock } from '$lib/types';

	export let content: BlockContent<ImageBlock>;

	let alt = content.caption?.[0] ?? 'image';
</script>

<img src={content.file.url} {alt} />
