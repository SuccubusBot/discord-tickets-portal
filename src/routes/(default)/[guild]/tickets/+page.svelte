<script>
	import { page } from '$app/stores';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	let query = $state('');

	const dateTime = new Intl.DateTimeFormat(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short'
	});
	const shown = $derived(
		data.tickets.filter((ticket) => {
			const term = query.trim().toLowerCase();
			const matchesQuery =
				!term ||
				[ticket.number, ticket.id, ticket.topic, ticket.createdById]
					.filter(Boolean)
					.some((value) => String(value).toLowerCase().includes(term));
			return matchesQuery;
		})
	);
</script>

<svelte:head>
	<title>Tickets · {data.guild.name}</title>
</svelte:head>

<main class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
	<header class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<a
				href={`/${$page.params.guild}`}
				class="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blurple focus:outline-none focus-visible:ring-2 focus-visible:ring-blurple dark:text-slate-400"
			>
				<i class="fa-solid fa-arrow-left"></i>
				{data.guild.name}
			</a>
			<h1 class="text-3xl font-bold text-dgrey-900 dark:text-white">Tickets</h1>
			<p class="mt-1 text-sm text-gray-500 dark:text-slate-400">
				{data.tickets.length}
				{data.tickets.length === 1 ? 'ticket' : 'tickets'} on this page
			</p>
		</div>
	</header>

	<div
		class="mb-5 flex flex-col gap-3 border-b border-gray-200 pb-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
	>
		<label class="relative block w-full sm:max-w-md">
			<span class="sr-only">Search this page</span>
			<i
				class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-3 text-gray-400"
			></i>
			<input
				type="search"
				placeholder="Search this page by number, topic, or ID"
				class="input m-0 pl-10"
				bind:value={query}
			/>
		</label>

		<div
			class="inline-flex w-fit rounded-lg bg-gray-200 p-1 dark:bg-dgrey-950"
			aria-label="Ticket status"
		>
			{#each ['all', 'open', 'closed'] as option}
				<a
					href={`?status=${option}`}
					aria-current={data.status === option ? 'page' : undefined}
					class="rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blurple {data.status ===
					option
						? 'bg-white text-dgrey-900 shadow-sm dark:bg-dgrey-700 dark:text-white'
						: 'text-gray-600 hover:text-dgrey-900 dark:text-slate-400 dark:hover:text-white'}"
				>
					{option}
				</a>
			{/each}
		</div>
	</div>

	{#if shown.length}
		<div
			class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-dgrey-700"
		>
			<div
				class="hidden grid-cols-[minmax(0,1fr)_9rem_9rem_8rem] gap-4 border-b border-gray-200 px-5 py-3 text-xs font-semibold text-gray-500 dark:border-slate-700 dark:text-slate-400 md:grid"
			>
				<span>Ticket</span>
				<span>Created</span>
				<span>Last activity</span>
				<span>Status</span>
			</div>
			<div class="divide-y divide-gray-200 dark:divide-slate-700">
				{#each shown as ticket}
					<a
						href={`/transcripts/${data.guild.id}/${ticket.id}`}
						class="group grid gap-3 px-5 py-4 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blurple dark:hover:bg-dgrey-600 md:grid-cols-[minmax(0,1fr)_9rem_9rem_8rem] md:items-center md:gap-4"
					>
						<div class="min-w-0">
							<div class="flex items-center gap-2">
								<span class="font-semibold text-dgrey-900 dark:text-white"
									>Ticket #{ticket.number}</span
								>
								<i
									class="fa-solid fa-arrow-right text-xs text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blurple dark:text-slate-600"
								></i>
							</div>
							<p class="mt-1 truncate text-sm text-gray-500 dark:text-slate-400">
								{ticket.topic || `Created by ${ticket.createdById}`}
							</p>
						</div>
						<div class="text-sm text-gray-600 dark:text-slate-300">
							<span class="mr-2 text-xs text-gray-400 md:hidden">Created</span>
							{dateTime.format(new Date(ticket.createdAt))}
						</div>
						<div class="text-sm text-gray-600 dark:text-slate-300">
							<span class="mr-2 text-xs text-gray-400 md:hidden">Last activity</span>
							{ticket.lastMessageAt
								? dateTime.format(new Date(ticket.lastMessageAt))
								: 'No messages'}
						</div>
						<div>
							<span
								class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold {ticket.open
									? 'bg-green-100 text-green-700 dark:bg-green-400/10 dark:text-green-300'
									: 'bg-gray-100 text-gray-600 dark:bg-slate-600 dark:text-slate-300'}"
							>
								<i class="fa-solid {ticket.open ? 'fa-circle' : 'fa-lock'} text-[0.55rem]"></i>
								{ticket.open ? 'Open' : 'Closed'}
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{:else}
		<div
			class="rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-slate-600"
		>
			<i class="fa-regular fa-folder-open text-3xl text-gray-400 dark:text-slate-500"></i>
			<h2 class="mt-4 text-lg font-semibold text-dgrey-900 dark:text-white">No tickets found</h2>
			<p class="mt-1 text-sm text-gray-500 dark:text-slate-400">
				{query || data.status !== 'all'
					? 'Try a different search or status.'
					: 'This server has no archived tickets yet.'}
			</p>
		</div>
	{/if}

	<nav aria-label="Ticket pages" class="mt-5 flex items-center justify-between text-sm">
		<div>
			{#if data.newer}
				<a href={`?status=${data.status}&after=${data.newer}`} class="text-blurple hover:underline">
					Newer tickets
				</a>
			{/if}
		</div>
		{#if data.older}
			<a href={`?status=${data.status}&before=${data.older}`} class="text-blurple hover:underline">
				Older tickets
			</a>
		{/if}
	</nav>
</main>
