import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
// @ts-ignore
import { importExtra } from "../lib/loader-import.cjs";
import { tryImportExtra } from '../lib/loader-import-try';

describe('importExtra', () =>
{
	test('應該能夠動態導入存在的模組', async (t) =>
	{
		const result = await importExtra('jest');
		// t.assert.snapshot(result);
		t.assert.notEqual(result, undefined);
	});
});

describe('tryImportExtra', () =>
{
	test('應該能夠動態導入存在的模組', async () =>
	{
		const result = await tryImportExtra('jest');
		assert.notStrictEqual(result, undefined);
		assert.notStrictEqual(result, null);
	});

	test('應該返回 null 當模組不存在', async () =>
	{
		const result = await tryImportExtra('this-module-definitely-does-not-exist-12345');
		assert.strictEqual(result, null);
	});
});
