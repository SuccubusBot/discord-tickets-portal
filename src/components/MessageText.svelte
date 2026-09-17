<script>
	import { marked } from 'marked';
	import { safeHttpUrl } from '$lib/transcript';
	let { text = '' } = $props();
	const tokens = $derived(marked.lexer(String(text), { breaks: true, gfm: true }));
	// Marked escapes token text for HTML output; Svelte performs its own escaping.
	const literal = (value) =>
		String(value).replace(
			/&(amp|lt|gt|quot|#39);/g,
			(entity) => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" })[entity]
		);
</script>

{#snippet renderTokens(items)}
	{#each items as token}
		{#if token.type === 'strong'}<strong>{@render renderTokens(token.tokens)}</strong>
		{:else if token.type === 'em'}<em>{@render renderTokens(token.tokens)}</em>
		{:else if token.type === 'del'}<del>{@render renderTokens(token.tokens)}</del>
		{:else if token.type === 'codespan'}<code class="rounded bg-gray-200 px-1 dark:bg-dgrey-900"
				>{literal(token.text)}</code
			>
		{:else if token.type === 'code'}<pre
				class="my-2 overflow-x-auto rounded bg-gray-200 p-2 dark:bg-dgrey-900"><code
					>{token.text}</code
				></pre>
		{:else if token.type === 'br'}<br />
		{:else if token.type === 'link'}
			{#if safeHttpUrl(token.href)}<a
					href={safeHttpUrl(token.href)}
					target="_blank"
					rel="noreferrer"
					class="text-blurple hover:underline">{@render renderTokens(token.tokens)}</a
				>
			{:else}{@render renderTokens(token.tokens)}{/if}
		{:else if token.type === 'image'}
			{#if safeHttpUrl(token.href)}<a
					href={safeHttpUrl(token.href)}
					target="_blank"
					rel="noreferrer"
					class="text-blurple hover:underline">{token.text || 'Image'}</a
				>{:else}{token.text}{/if}
		{:else if token.type === 'blockquote'}<blockquote class="my-1 border-l-2 border-gray-400 pl-3">
				{@render renderTokens(token.tokens)}
			</blockquote>
		{:else if token.type === 'list'}
			{#if token.ordered}<ol start={token.start} class="list-decimal pl-5">
					{#each token.items as item}<li>{@render renderTokens(item.tokens)}</li>{/each}
				</ol>
			{:else}<ul class="list-disc pl-5">
					{#each token.items as item}<li>{@render renderTokens(item.tokens)}</li>{/each}
				</ul>{/if}
		{:else if token.type === 'paragraph' || token.type === 'heading'}<div>
				{@render renderTokens(token.tokens)}
			</div>
		{:else if token.tokens}{@render renderTokens(token.tokens)}
		{:else if token.type !== 'space'}{literal(token.text || token.raw)}{/if}
	{/each}
{/snippet}

<div class="whitespace-pre-wrap break-words">{@render renderTokens(tokens)}</div>
