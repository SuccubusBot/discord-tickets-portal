<script>
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<div
	class="absolute h-max min-h-screen w-full bg-dgrey-100 text-dgrey-600 dark:bg-dgrey-800 dark:text-dgrey-300"
>
	{@render children?.()}
</div>
