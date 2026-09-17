import assert from 'node:assert/strict';
import { parseMessageContent, safeHttpUrl } from '../src/lib/transcript.js';

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

console.log('transcript helpers: ok');
