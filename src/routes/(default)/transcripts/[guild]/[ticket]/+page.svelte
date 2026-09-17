<script>
	import { parseMessageContent } from '$lib/transcript';
	import MessageContent from '$components/MessageContent.svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	const fullDate = new Intl.DateTimeFormat(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short'
	});
	const messageTime = new Intl.DateTimeFormat(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short'
	});
	const users = $derived(new Map(data.ticket.archivedUsers.map((user) => [user.userId, user])));
	const roles = $derived(new Map(data.ticket.archivedRoles.map((role) => [role.roleId, role])));

	const displayName = (user) => user?.displayName || user?.username || 'Unknown user';
	const avatar = (user) =>
		user?.avatar
			? `https://cdn.discordapp.com/avatars/${user.userId}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=64`
			: null;
	const roleColour = (user) => {
		const colour = roles.get(user?.roleId)?.colour;
		return /^[0-9a-f]{6}$/i.test(colour || '') ? `#${colour}` : null;
	};
</script>

<svelte:head>
	<title>Ticket #{data.ticket.number} · {data.guild.name}</title>
</svelte:head>

<main class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
	<a
		href={`/${data.guildSlug}/tickets`}
		class="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blurple focus:outline-none focus-visible:ring-2 focus-visible:ring-blurple dark:text-slate-400"
	>
		<i class="fa-solid fa-arrow-left"></i>
		All tickets
	</a>

	<header class="mb-8 border-b border-gray-200 pb-6 dark:border-slate-700">
		<div class="flex flex-wrap items-center gap-3">
			<h1 class="text-3xl font-bold text-dgrey-900 dark:text-white">
				Ticket #{data.ticket.number}
			</h1>
			<span
				class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold {data
					.ticket.open
					? 'bg-green-100 text-green-700 dark:bg-green-400/10 dark:text-green-300'
					: 'bg-gray-200 text-gray-600 dark:bg-slate-600 dark:text-slate-300'}"
			>
				<i class="fa-solid {data.ticket.open ? 'fa-circle' : 'fa-lock'} text-[0.55rem]"></i>
				{data.ticket.open ? 'Open' : 'Closed'}
			</span>
		</div>
		<p class="mt-2 max-w-3xl text-gray-600 dark:text-slate-300">
			{data.ticket.topic || 'No topic was provided for this ticket.'}
		</p>
	</header>

	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
		<section aria-labelledby="messages-heading">
			<div class="mb-4 flex items-center justify-between">
				<h2 id="messages-heading" class="text-lg font-semibold text-dgrey-900 dark:text-white">
					Messages
				</h2>
				<span class="text-sm text-gray-500 dark:text-slate-400">
					{data.ticket.archivedMessages.length}
				</span>
			</div>

			{#if data.ticket.archivedMessages.length}
				<div
					class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-dgrey-700"
				>
					{#each data.ticket.archivedMessages as message}
						{@const author = users.get(message.authorId)}
						{@const content = parseMessageContent(message.content)}
						<article
							class="flex gap-3 border-b border-gray-100 px-4 py-4 last:border-0 dark:border-slate-600 sm:px-5"
						>
							{#if avatar(author)}
								<img
									src={avatar(author)}
									alt=""
									class="h-10 w-10 shrink-0 rounded-full bg-gray-200 object-cover dark:bg-slate-600"
								/>
							{:else}
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-slate-600 dark:text-slate-300"
								>
									<i class="fa-solid fa-user"></i>
								</div>
							{/if}
							<div class="min-w-0 flex-1">
								<div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
									<strong class="font-semibold" style:color={roleColour(author)}
										>{displayName(author)}</strong
									>
									{#if author?.bot}
										<span
											class="rounded bg-blurple px-1.5 py-0.5 text-[0.65rem] font-semibold text-white"
											>Bot</span
										>
									{/if}
									<time class="text-xs text-gray-400" datetime={message.createdAt}>
										{messageTime.format(new Date(message.createdAt))}
									</time>
									{#if message.edited}<span class="text-xs text-gray-400">edited</span>{/if}
									{#if message.deleted}<span class="text-xs text-red-500">deleted</span>{/if}
								</div>

								<MessageContent
									{content}
									guildId={data.guild.id}
									ticketId={data.ticket.id}
									messageId={message.id}
								/>
								{#if content.revisions?.length}
									<details class="mt-3 border-t border-gray-200 pt-2 dark:border-slate-600">
										<summary class="cursor-pointer text-sm text-gray-500 dark:text-slate-400"
											>Edit history ({content.revisions.length} previous versions)</summary
										>
										{#each content.revisions as revision}
											<div class="mt-3 border-l-2 border-gray-300 pl-3 dark:border-slate-600">
												<p class="text-xs text-gray-500 dark:text-slate-400">
													{revision.editedAt
														? messageTime.format(new Date(revision.editedAt))
														: 'Original message'}
												</p>
												<MessageContent
													content={revision}
													guildId={data.guild.id}
													ticketId={data.ticket.id}
													messageId={message.id}
												/>
											</div>
										{/each}
									</details>
								{/if}
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div
					class="rounded-xl border border-dashed border-gray-300 px-6 py-14 text-center dark:border-slate-600"
				>
					<i class="fa-regular fa-message text-3xl text-gray-400 dark:text-slate-500"></i>
					<p class="mt-3 text-gray-500 dark:text-slate-400">No archived messages are available.</p>
				</div>
			{/if}
		</section>

		<aside class="space-y-7 lg:sticky lg:top-6 lg:self-start">
			<section aria-labelledby="details-heading">
				<h2 id="details-heading" class="mb-3 text-sm font-semibold text-dgrey-900 dark:text-white">
					Details
				</h2>
				<dl class="space-y-3 text-sm">
					<div>
						<dt class="text-gray-500 dark:text-slate-400">Server</dt>
						<dd class="mt-0.5 font-medium text-dgrey-900 dark:text-white">{data.guild.name}</dd>
					</div>
					{#if data.ticket.category}
						<div>
							<dt class="text-gray-500 dark:text-slate-400">Category</dt>
							<dd class="mt-0.5 font-medium text-dgrey-900 dark:text-white">
								{data.ticket.category.name}
							</dd>
						</div>
					{/if}
					<div>
						<dt class="text-gray-500 dark:text-slate-400">Created</dt>
						<dd class="mt-0.5 text-dgrey-900 dark:text-white">
							{fullDate.format(new Date(data.ticket.createdAt))}
						</dd>
					</div>
					{#if data.ticket.closedAt}
						<div>
							<dt class="text-gray-500 dark:text-slate-400">Closed</dt>
							<dd class="mt-0.5 text-dgrey-900 dark:text-white">
								{fullDate.format(new Date(data.ticket.closedAt))}
							</dd>
						</div>
					{/if}
					{#if data.ticket.closedReason}
						<div>
							<dt class="text-gray-500 dark:text-slate-400">Reason</dt>
							<dd class="mt-0.5 whitespace-pre-wrap text-dgrey-900 dark:text-white">
								{data.ticket.closedReason}
							</dd>
						</div>
					{/if}
				</dl>
			</section>

			{#if data.ticket.archivedUsers.length}
				<section aria-labelledby="participants-heading">
					<h2
						id="participants-heading"
						class="mb-3 text-sm font-semibold text-dgrey-900 dark:text-white"
					>
						Participants
					</h2>
					<ul class="space-y-2">
						{#each data.ticket.archivedUsers as user}
							<li class="flex items-center gap-2 text-sm">
								{#if avatar(user)}
									<img
										src={avatar(user)}
										alt=""
										class="h-7 w-7 rounded-full bg-gray-200 object-cover dark:bg-slate-600"
									/>
								{:else}
									<span
										class="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500 dark:bg-slate-600 dark:text-slate-300"
									>
										<i class="fa-solid fa-user"></i>
									</span>
								{/if}
								<span class="truncate text-dgrey-900 dark:text-white">{displayName(user)}</span>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if data.ticket.questionAnswers.length}
				<section aria-labelledby="questions-heading">
					<h2
						id="questions-heading"
						class="mb-3 text-sm font-semibold text-dgrey-900 dark:text-white"
					>
						Questions
					</h2>
					<dl class="space-y-3 text-sm">
						{#each data.ticket.questionAnswers as answer}
							<div>
								<dt class="text-gray-500 dark:text-slate-400">
									{answer.question?.label || 'Question'}
								</dt>
								<dd class="mt-0.5 whitespace-pre-wrap text-dgrey-900 dark:text-white">
									{answer.value || 'No answer'}
								</dd>
							</div>
						{/each}
					</dl>
				</section>
			{/if}
		</aside>
	</div>
</main>
