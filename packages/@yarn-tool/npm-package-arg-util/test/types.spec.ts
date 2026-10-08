import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { packageNameToTypes } from '../lib/packageNameToTypes';

describe(`packageNameToTypes`, () =>
{

	test(`@next/typescript@^1.3.1`, (t) =>
	{

		let actual = packageNameToTypes(`@next/typescript@^1.3.1`);

		assert.strictEqual(actual.name, '@types/next__typescript');

		t.assert.snapshot(actual);

	});

	test(`@types/typescript@^1.3.1`, (t: test.TestContext) =>
	{

		let actual = packageNameToTypes(`@types/typescript@^1.3.1`);

		t.assert.strictEqual(actual.name, '@types/typescript');

		t.assert.snapshot(actual);

	});

})
