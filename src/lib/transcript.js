export function parseMessageContent(value) {
	if (value && typeof value === 'object') return value;
	if (typeof value !== 'string') return { content: '' };

	try {
		const parsed = JSON.parse(value);
		return parsed && typeof parsed === 'object' ? parsed : { content: String(parsed ?? '') };
	} catch {
		return { content: value };
	}
}

export function safeHttpUrl(value) {
	try {
		const url = new URL(value);
		return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
	} catch {
		return null;
	}
}

export function messageEmbeds(content) {
	return (Array.isArray(content.embeds) ? content.embeds : [])
		.map((embed) => embed?.data || embed)
		.filter((embed) => embed && typeof embed === 'object');
}

export function messageComponentRows(content) {
	const unwrap = (component) => component?.data || component;
	return (Array.isArray(content.components) ? content.components : [])
		.map((row) => {
			const data = unwrap(row);
			const components = row?.components || data?.components;
			return data?.type === 1 && Array.isArray(components) ? components.map(unwrap) : [data];
		})
		.map((row) => row.filter((component) => component && typeof component === 'object'));
}

export function attachmentUrl(guild, ticket, message, attachment) {
	const ids = [guild, ticket, message, attachment.id];
	if (!ids.every((id) => /^\d{16,20}$/.test(id))) return null;
	return `/api/admin/guilds/${guild}/tickets/${ticket}/messages/${message}/attachments/${attachment.id}`;
}
