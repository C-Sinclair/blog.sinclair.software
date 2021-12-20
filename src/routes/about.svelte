<script context="module">
	import { browser, dev } from '$app/env';
	/**
	 * Only use JS on this page in dev
	 * (For hot mod reloading)
	 */
	export const hydrate = dev;
	/**
	 * If this is an internal link use app router
	 */
	export const router = browser;
	/**
	 * No dynamic data on this page, so serve as static in prod
	 */
	export const prerender = true;
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<div class="content">
	<h1>About me</h1>

	<p>
		I'm Conor.
	</p>

	<p>
		I do dev.
	</p>
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
