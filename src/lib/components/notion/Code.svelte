<script lang="ts">
  import type { BlockContent } from "$lib/types";

  export let content: BlockContent    
</script>

<pre>
  <code>
    {#each content?.text ?? [] as { text }}
      {Array.isArray(text?.content) ? text.content.join("\n") : text.content}
    {/each}
  </code>
</pre>