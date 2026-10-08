import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe(`throw`, () =>
{

	test(`empty`, (t) =>
	{

		let actual;
		let expected;

		assert.deepStrictEqual(actual, expected);
		//expect(actual).toBeInstanceOf(Date);
		t.assert.snapshot(actual);

	});

})
