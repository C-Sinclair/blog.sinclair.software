<script lang="ts">
  import type { BlockContent } from "$lib/types";
  import Anchor from "./Anchor.svelte";

  export let content: BlockContent  
</script>

<li>
  {#each content?.text ?? [] as { text }}
    <Anchor link={text.link}>{text.content}</Anchor>
  {/each}
</li>