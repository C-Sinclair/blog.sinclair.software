<script lang="ts">
	import Footer from '$lib/components/footer/Footer.svelte';
	import '../app.css';
</script>

<main>
	<slot />
</main>

<Footer />

<style>
	main {
		display: flex;
		flex-direction: column;
		padding-bottom: var(--spacing-m);
	}
</style>
