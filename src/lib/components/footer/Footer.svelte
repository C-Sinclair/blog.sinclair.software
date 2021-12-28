<script lang="ts">
	import Scribble from '../scribble/Scribble.svelte';

	type Link = {
		title: string;
		href: string;
		description?: string;
		icon?: string;
		image?: string;
	};

	const libs: Link[] = [
		{
			title: 'SvelteKit',
			href: 'https://kit.svelte.dev/',
			image: '/svelte-logo.svg'
		},
		{
			title: 'Notion',
			href: 'https://notion.so/',
			image: '/notion-logo.png'
		},
		{
			title: 'Netlify',
			href: 'https://www.netlify.com/',
			image: '/netlify-logo.png'
		}
	];

	const links: Link[] = [
		{
			href: '/',
			title: 'Articles',
			description: `More thrilling pieces I've written`,
			icon: '🖊'
		},
		{
			href: 'https://shorts.sinclair.software',
			title: 'Shorts',
			description: 'Short videos I make about all things dev',
			icon: '📽'
		},
		{
			href: 'https://c.sinclair.software',
			title: 'Curriculum Vitae',
			description: 'A digital version of my CV',
			icon: '🎩'
		},
		{
			href: 'https://irrelevantbeats.com',
			title: 'Music',
			description: `That's right I make music (sometimes) too.`,
			icon: '𝄞'
		}
	];
</script>

<footer>
	<div>
		<section class="built-with">
			<h1>Built with</h1>
			<ul>
				{#each libs as lib}
					<li>
						<a href={lib.href} target="__blank">
							<img src={lib.image} alt={`${lib.title} logo`} />
							<div class="text">
								<h4>{lib.title}</h4>
								{#if lib.description}
									<p>{lib.description}</p>
								{/if}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</section>
		<hr />
		<section class="links">
			<h1>Navigation</h1>
			<ul>
				{#each links as link}
					<li>
						<a href={link.href}>
							<Scribble />
							<div class="icon">
								<span>{link.icon}</span>
							</div>
							<div class="text">
								<h4>{link.title}</h4>
								{#if link.description}
									<p>{link.description}</p>
								{/if}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</footer>

<style>
	footer {
		background-color: var(--selection-soft-color);
		padding: var(--spacing-m);
		width: 100%;
	}
	footer > div {
		max-width: var(--page-max-width);
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	hr {
		color: var(--purple);
	}
	p,
	h4 {
		margin: 0;
	}
	li {
		margin-bottom: var(--spacing-s);
		position: relative;
	}
	li > a {
		display: flex;
		z-index: 2;
	}
	li .icon {
		width: 2em;
		align-self: center;
	}
	li .text {
		width: 100%;
		align-self: center;
	}
	li img {
		width: 2em;
		height: 2em;
		margin-right: var(--spacing-xs);
	}
	li :global(svg.scribble) {
		position: absolute;
		left: -20px;
		top: 0;
		height: 100%;
		z-index: 1;
		opacity: 0;
		transition: opacity 0.3s ease;
		transform: scale(1.4);
	}
	li:hover :global(svg.scribble) {
		opacity: 0.2;
		cursor: pointer;
	}

	@media only screen and (max-width: 650px) {
		footer > div {
			flex-direction: column-reverse;
		}
		hr {
			display: none;
		}
		section {
			margin-bottom: var(--spacing-s);
		}
	}
</style>
