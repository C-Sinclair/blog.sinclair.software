<script lang="ts">
  import type { BlockContent } from "$lib/types";

  export let content: BlockContent  
  export let id = `todo-item-${Math.abs(Math.random() * 100)}`  
</script>

<div>
  <label for={id}>
    <input type="checkbox" id={id}  />
    {content.text}
  </label>
</div>