<script lang="ts">
	export let tag: {
		id: string;
		name: string;
		color: string;
	};
</script>

<li class={tag.color}>
	{tag.name}
</li>

<style>
	li {
		/** Purple by default */
		--colour: var(--purple);

		background-color: var(--colour);
		padding: calc(var(--spacing-xxs) / 2) var(--spacing-xs);
		margin-right: var(--spacing-xs);
		border-radius: var(--spacing-s);
		font-size: 0.75em;
		color: var(--black-soft);
	}
	.gray {
		--colour: var(--gray);
	}
	.orange {
		--colour: var(--orange);
	}
	.pink {
		--colour: var(--pink);
	}
	.red {
		--colour: var(--red);
	}
	.blue {
		--colour: var(--blue);
	}
	.green {
		--colour: var(--green);
	}
	.yellow {
		--colour: var(--orange-soft);
	}
</style>
