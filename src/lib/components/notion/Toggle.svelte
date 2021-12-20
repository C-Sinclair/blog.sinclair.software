<script lang="ts">
  import type { BlockContent } from "$lib/types";
  import Block from "./Block.svelte";

  export let content: BlockContent    
</script>

<details>
  <summary>{content?.text ?? []}</summary>
  {#each content?.children as block}
    <Block {block} />
  {/each}
</details>