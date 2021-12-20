<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import Footer from '$lib/header/Footer.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<Footer />

<style>

</style>
