<script>
	import MessageText from './MessageText.svelte';
	import { attachmentUrl, messageEmbeds, safeHttpUrl } from '$lib/transcript';
	let { content, guildId, ticketId, messageId } = $props();
	const colour = (value) =>
		Number.isInteger(value) && value >= 0 && value <= 0xffffff
			? `#${value.toString(16).padStart(6, '0')}`
			: null;
</script>

{#if content.content}
	<div class="mt-1 text-[0.95rem] leading-6 text-dgrey-900 dark:text-slate-100">
		<MessageText text={content.content} />
	</div>
{/if}

{#if content.attachments?.length}
	<ul class="mt-3 space-y-2">
		{#each content.attachments as attachment}
			{@const href = attachmentUrl(guildId, ticketId, messageId, attachment)}
			<li>
				{#if href}
					<a
						{href}
						target="_blank"
						rel="noreferrer"
						class="inline-flex max-w-full items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-blurple hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blurple dark:bg-dgrey-800"
					>
						<i class="fa-solid fa-paperclip"></i>
						<span class="truncate">{attachment.name || attachment.filename || 'Attachment'}</span>
					</a>
				{:else}
					<span class="text-sm text-gray-500">{attachment.name || 'Attachment'} — unavailable</span>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

{#each messageEmbeds(content) as embed}
	<div
		class="mt-3 max-w-full border-l-4 border-blurple bg-gray-50 p-3 text-sm dark:bg-dgrey-800"
		style:border-left-color={colour(embed.color)}
	>
		{#if safeHttpUrl(embed.thumbnail?.url)}
			<img
				src={safeHttpUrl(embed.thumbnail.url)}
				alt="Embed thumbnail"
				loading="lazy"
				class="float-right ml-3 max-h-20 max-w-20 rounded-md object-contain"
			/>
		{/if}
		{#if embed.author?.name}
			<div class="mb-2 flex items-center gap-2 font-semibold">
				{#if safeHttpUrl(embed.author.icon_url)}<img
						src={safeHttpUrl(embed.author.icon_url)}
						alt=""
						loading="lazy"
						class="h-6 w-6 rounded-full"
					/>{/if}
				{#if safeHttpUrl(embed.author.url)}
					<a
						href={safeHttpUrl(embed.author.url)}
						target="_blank"
						rel="noreferrer"
						class="hover:underline">{embed.author.name}</a
					>
				{:else}{embed.author.name}{/if}
			</div>
		{/if}
		{#if embed.title}
			<p class="break-words font-semibold">
				{#if safeHttpUrl(embed.url)}<a
						href={safeHttpUrl(embed.url)}
						target="_blank"
						rel="noreferrer"
						class="text-blurple hover:underline">{embed.title}</a
					>
				{:else}{embed.title}{/if}
			</p>
		{/if}
		{#if embed.description}<div class="mt-1"><MessageText text={embed.description} /></div>{/if}
		{#if Array.isArray(embed.fields)}
			<dl class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
				{#each embed.fields as field}
					<div class={field.inline ? '' : 'sm:col-span-3'}>
						<dt class="whitespace-pre-wrap break-words font-semibold">{field.name}</dt>
						<dd class="mt-1"><MessageText text={field.value} /></dd>
					</div>
				{/each}
			</dl>
		{/if}
		{#if safeHttpUrl(embed.image?.url)}<img
				src={safeHttpUrl(embed.image.url)}
				alt={embed.title || 'Embedded image'}
				loading="lazy"
				class="mt-3 max-h-96 max-w-full rounded-md object-contain"
			/>{/if}
		{#if safeHttpUrl(embed.video?.url)}<a
				href={safeHttpUrl(embed.video.url)}
				target="_blank"
				rel="noreferrer"
				class="mt-2 inline-block text-blurple hover:underline">Open embedded video</a
			>{/if}
		{#if embed.footer?.text || embed.timestamp}
			<div class="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
				{#if safeHttpUrl(embed.footer?.icon_url)}<img
						src={safeHttpUrl(embed.footer.icon_url)}
						alt=""
						loading="lazy"
						class="h-5 w-5 rounded-full"
					/>{/if}
				{#if embed.footer?.text}<span>{embed.footer.text}</span>{/if}
				{#if embed.timestamp && !Number.isNaN(Date.parse(embed.timestamp))}<time
						datetime={embed.timestamp}>{new Date(embed.timestamp).toLocaleString()}</time
					>{/if}
			</div>
		{/if}
		<div class="clear-both"></div>
	</div>
{/each}
