
import { describe, test, TestContext } from 'node:test';
import { buildResolvePaths } from '../lib/core';
import { SymbolCurrentDirectory, SymbolGlobal } from '@yarn-tool/get-paths-by-type';

describe('options', () =>
{
	test('buildResolvePaths', () =>
	{

		test('includeGlobal', (t: TestContext) =>
		{
			const paths = buildResolvePaths({
				includeGlobal: true,
			});
			t.assert.strictEqual(paths.includes(SymbolGlobal), true);
		});

		test('includeCurrentDirectory', (t: TestContext) =>
		{
			const paths = buildResolvePaths({
				includeCurrentDirectory: true,
			});
			t.assert.strictEqual(paths.includes(SymbolCurrentDirectory), true);
		});

		test('default return', (t: TestContext) =>
		{
			const paths = buildResolvePaths({});
			t.assert.snapshot(paths);
		});

	});
});
