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
</script>

{#if block.type === 'paragraph'}
  <Paragraph content={block.paragraph} />
{/if}
{#if block.type === 'heading_1'}
  <H1 content={block.heading_1} />
{/if}
{#if block.type === 'heading_2'}
  <H2 content={block.heading_2} />
{/if}
{#if block.type === 'heading_3'}
  <H3 content={block.heading_3} />
{/if}
{#if block.type === 'callout'}
  <Callout content={block.callout} />
{/if}
{#if block.type === 'bulleted_list_item'}
  <BulletListItem content={block.bulleted_list_item} />
{/if}
{#if block.type === 'numbered_list_item'}
  <NumberedListItem content={block.numbered_list_item} />
{/if}
{#if block.type === 'to_do'}
  <ToDo content={block.to_do} />
{/if}
{#if block.type === 'toggle'}
  <Toggle content={block.toggle} />
{/if}
{#if block.type === 'code'}
  <Code content={block.code} />
{/if}