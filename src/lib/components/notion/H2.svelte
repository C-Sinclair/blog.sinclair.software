<script lang="ts">
  import type { BlockContent } from "$lib/types";
  import Anchor from "./Anchor.svelte";

  export let content: BlockContent  
</script>

{#each content?.text ?? [] as {text}}
  <Anchor link={text.link}>
    <h2>{text.content}</h2>
  </Anchor>
{/each}