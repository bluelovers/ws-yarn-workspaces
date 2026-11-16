
import { test, TestContext } from 'node:test';
import { getWsCopyStaticFiles } from '../lib/ws/wsCopyStaticFiles';

test('getWsCopyStaticFiles()', (t: TestContext) =>
{
    const result = getWsCopyStaticFiles();

		t.assert.snapshot(result);

		t.assert.partialDeepStrictEqual(result, [
			[
				"jest.config.js",
				"file/ws-root/jest.config.js"
			]
		]);
})
