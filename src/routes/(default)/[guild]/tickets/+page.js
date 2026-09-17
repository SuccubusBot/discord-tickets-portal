import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, parent, url }) {
	const { guild } = await parent();
	const pageSize = 25;
	const query = new URLSearchParams({ limit: String(pageSize + 1) });
	for (const key of ['before', 'after', 'status']) {
		if (url.searchParams.has(key)) query.set(key, url.searchParams.get(key));
	}
	const response = await fetch(`/api/admin/guilds/${guild.id}/tickets?${query}`);
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();

	if (response.status === 401 && body.elevate) {
		redirect(
			307,
			`/auth/login?r=${encodeURIComponent(url.pathname + url.search)}&role=${body.elevate}`
		);
	} else if (!response.ok) {
		error(response.status, isJSON ? JSON.stringify(body) : body);
	}

	const hasMore = body.length > pageSize;
	const tickets = query.has('after') ? body.slice(-pageSize) : body.slice(0, pageSize);
	return {
		tickets,
		status: query.get('status') || 'all',
		newer: query.has('before') || (query.has('after') && hasMore) ? tickets[0]?.number : null,
		older: query.has('after') || hasMore ? tickets.at(-1)?.number : null
	};
}
