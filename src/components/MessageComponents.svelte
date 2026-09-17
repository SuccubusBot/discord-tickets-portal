<script>
	import { messageComponentRows, safeHttpUrl } from '$lib/transcript';
	let { content } = $props();
	const styles = {
		1: 'bg-blurple text-white',
		2: 'bg-gray-200 text-gray-800 dark:bg-slate-600 dark:text-white',
		3: 'bg-green-700 text-white',
		4: 'bg-red-700 text-white'
	};
	const emojiUrl = (emoji) =>
		/^\d{16,20}$/.test(emoji?.id || '')
			? `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}?size=32`
			: null;
</script>

{#snippet label(component)}
	{#if emojiUrl(component.emoji)}
		<img
			src={emojiUrl(component.emoji)}
			alt={component.emoji.name || ''}
			loading="lazy"
			class="h-5 w-5"
		/>
	{:else if component.emoji?.name}<span>{component.emoji.name}</span>{/if}
	{#if component.label}<span>{component.label}</span>{/if}
{/snippet}

{#each messageComponentRows(content) as row}
	<div class="mt-3 flex flex-wrap gap-2">
		{#each row as component}
			{#if component.type === 2}
				{@const className = `inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${styles[component.style] || styles[2]}`}
				{#if component.style === 5 && !component.disabled && safeHttpUrl(component.url)}
					<a
						href={safeHttpUrl(component.url)}
						target="_blank"
						rel="noreferrer"
						class="{className} hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blurple"
						aria-label={component.label || component.emoji?.name || 'Open link'}
					>
						{@render label(component)}
						<i class="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true"></i>
					</a>
				{:else}
					<button
						type="button"
						disabled
						class="{className} cursor-default"
						title="Archived button — use Discord to perform ticket actions"
						aria-label={component.label || component.emoji?.name || 'Archived button'}
					>
						{@render label(component)}
					</button>
				{/if}
			{:else if [3, 5, 6, 7, 8].includes(component.type)}
				<select
					disabled
					aria-label={component.placeholder || 'Archived selection menu'}
					class="max-w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600 dark:border-slate-600 dark:bg-dgrey-800 dark:text-slate-300"
				>
					<option>{component.placeholder || 'Select an option'}</option>
					{#each component.options || [] as option}<option selected={option.default}
							>{option.label}</option
						>{/each}
				</select>
			{/if}
		{/each}
	</div>
{/each}
