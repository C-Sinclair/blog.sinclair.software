<script lang="ts">
  import Paragraph from "./Paragraph.svelte";
  import H1 from "./H1.svelte";
  import H2 from "./H2.svelte";
  import H3 from "./H3.svelte";
  import Callout from "./Callout.svelte";
  import Toggle from "./Toggle.svelte";
  import Code from "./Code.svelte";
  import ToDo from "./ToDo.svelte";
  import NumberedListItem from "./NumberedListItem.svelte";
  import BulletListItem from "./BulletListItem.svelte";
  import type { BlockType } from "$lib/types";

  /**
   * Renders a Notion Block into Jsx components
   */
  export let block: BlockType

  let { content } = block
</script>

{#if block.type === 'paragraph'}
  <Paragraph {content} />
{/if}
{#if block.type === 'heading_1'}
  <H1 {content} />
{/if}
{#if block.type === 'heading_2'}
  <H2 {content} />
{/if}
{#if block.type === 'heading_3'}
  <H3 {content} />
{/if}
{#if block.type === 'callout'}
  <Callout {content} />
{/if}
{#if block.type === 'bulleted_list_item'}
  <BulletListItem {content} />
{/if}
{#if block.type === 'numbered_list_item'}
  <NumberedListItem {content} />
{/if}
{#if block.type === 'to_do'}
  <ToDo {content} />
{/if}
{#if block.type === 'toggle'}
  <Toggle {content} />
{/if}
{#if block.type === 'code'}
  <Code {content} />
{/if}