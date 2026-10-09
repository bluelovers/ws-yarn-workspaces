import { findIgnoreFilesGenerator } from '../lib/find';

for (const item of findIgnoreFilesGenerator({
	fileNames: [
		'.gitignore',
		'.npmignore',

		/**
		 * 用來展示 name 的實際結果
		 */
		'test/fixtures/ignore-files/.npmignore',
	],
}))
{
	console.log(item);
}
