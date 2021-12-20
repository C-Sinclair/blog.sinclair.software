<script lang="ts">
  import type { NotionTextLinkObject } from "$lib/types";

  export let link: NotionTextLinkObject  
</script>

{#if link}
  <a href={link.url}>
    <slot />
  </a>
{:else}
  <slot />
{/if}