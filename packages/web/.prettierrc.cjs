/** @type {import('prettier').Config} */
module.exports = {
	...require('../../.prettierrc.json'),
	plugins: ['prettier-plugin-svelte'],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
};
