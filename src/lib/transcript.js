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
