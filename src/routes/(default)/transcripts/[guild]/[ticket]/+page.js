import { error, redirect } from '@sveltejs/kit';
import Big from 'big-integer';

async function json(response) {
	const isJSON = response.headers.get('Content-Type')?.includes('json');
	const body = isJSON ? await response.json() : await response.text();
	return { body, isJSON };
}

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
	const [guildResponse, ticketResponse] = await Promise.all([
		fetch(`/api/guilds/${params.guild}`),
		fetch(`/api/admin/guilds/${params.guild}/tickets/${params.ticket}`)
	]);
	const guildResult = await json(guildResponse);
	const ticketResult = await json(ticketResponse);

	if (ticketResponse.status === 401 && ticketResult.body.elevate) {
		redirect(
			307,
			`/auth/login?r=${encodeURIComponent(url.pathname + url.search)}&role=${ticketResult.body.elevate}`
		);
	}
	if (!guildResponse.ok) {
		error(
			guildResponse.status,
			guildResult.isJSON ? JSON.stringify(guildResult.body) : guildResult.body
		);
	}
	if (!ticketResponse.ok) {
		error(
			ticketResponse.status,
			ticketResult.isJSON ? JSON.stringify(ticketResult.body) : ticketResult.body
		);
	}

	return {
		guild: guildResult.body,
		guildSlug: new Big(params.guild).toString(36),
		ticket: ticketResult.body
	};
}
