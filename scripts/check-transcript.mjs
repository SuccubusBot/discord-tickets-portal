import assert from 'node:assert/strict';
import {
	attachmentUrl,
	messageComponentRows,
	messageEmbeds,
	parseMessageContent,
	safeHttpUrl
} from '../src/lib/transcript.js';

assert.deepEqual(parseMessageContent('{"content":"hello","attachments":[]}'), {
	attachments: [],
	content: 'hello'
});
assert.deepEqual(parseMessageContent('plain text'), { content: 'plain text' });
assert.equal(
	safeHttpUrl('https://cdn.discordapp.com/file.png'),
	'https://cdn.discordapp.com/file.png'
);
assert.equal(safeHttpUrl('javascript:alert(1)'), null);
assert.deepEqual(
	messageEmbeds({
		embeds: [{ data: { title: 'Legacy', fields: [{ name: 'Question', value: 'Answer' }] } }]
	}),
	[{ title: 'Legacy', fields: [{ name: 'Question', value: 'Answer' }] }]
);
assert.deepEqual(messageEmbeds({ embeds: [{ title: 'New' }, null] }), [{ title: 'New' }]);
assert.equal(
	attachmentUrl('997372719555412008', '997372719555412009', '997372719555412010', {
		id: '997372719555412011'
	}),
	'/api/admin/guilds/997372719555412008/tickets/997372719555412009/messages/997372719555412010/attachments/997372719555412011'
);
assert.equal(attachmentUrl('../secret', '1', '2', { id: '3' }), null);
const closeButton = { type: 2, style: 4, label: 'Close ticket', custom_id: 'close' };
assert.deepEqual(messageComponentRows({ components: [{ type: 1, components: [closeButton] }] }), [
	[closeButton]
]);
assert.deepEqual(
	messageComponentRows({
		components: [{ data: { type: 1 }, components: [{ data: closeButton }] }]
	}),
	[[closeButton]]
);

console.log('transcript helpers: ok');
