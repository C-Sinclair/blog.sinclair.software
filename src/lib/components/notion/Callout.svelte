<script lang="ts">
  import type { BlockContent } from "$lib/types";

  export let content: BlockContent  
</script>

<section class="callout">
  {#if content.icon} 
    <span class="emoji">{content.icon.emoji}</span>
  {/if}
  <span class="text">
    <p>
      {#each content.text as { text, annotations }}
        {#if annotations.code} 
          <code>{text.content}</code> 
        {:else}
          {text.content}
        {/if}        
      {/each}
    </p>
  </span>
</section>