<script lang="ts">
  const parties = [{
    name: 'SvelteKit'
  }, {
    name: 'Notion'
  }]
</script>

<footer>
  <h4>Built with these awesome technologies</h4>
  <ul>
    {#each parties as lib}
      <li>{lib.name}</li>
    {/each}
  </ul>
</footer>

<style>
  footer {
    background-color: var(--selection-soft-color);
    padding: var(--spacing-m);
  }
</style>