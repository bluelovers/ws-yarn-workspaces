import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';
import { _lazyTestNpaTypeGuard } from './lib/test';

before(async () =>
{

});

const FAKE_NAME = '@fake/fake' as const

describe(`Any`, () =>
{
	[
		'',
		' ',
		'*',
	].forEach(value =>
	{
		const title = value === '' ? 'empty' : value === ' ' ? 'space' : 'star';

		describe(title, () =>
		{
			const isInputSpecIsStar = value === '*';
			let expected = {
				isInputSpecIsEmpty: !isInputSpecIsStar,
				isInputSpecIsStar,
			} satisfies Partial<ReturnType<typeof _lazyTestNpaTypeGuard>>;

			test(title, (t) =>
			{
				let actual = _lazyTestNpaTypeGuard(value);
				assert.strictEqual(actual.isInputSpecIsEmpty, expected.isInputSpecIsEmpty);
				assert.strictEqual(actual.isInputSpecIsStar, expected.isInputSpecIsStar);
				t.assert.snapshot(actual);
			});

			test(`${FAKE_NAME}@${value}`, (t) =>
			{
				let actual = _lazyTestNpaTypeGuard(`${FAKE_NAME}@${value}`);
				assert.strictEqual(actual.isInputSpecIsEmpty, expected.isInputSpecIsEmpty);
				assert.strictEqual(actual.isInputSpecIsStar, expected.isInputSpecIsStar);
				t.assert.snapshot(actual);
			});

			test(`fake@${value}`, (t) =>
			{
				let actual = _lazyTestNpaTypeGuard(`fake@${value}`);
				assert.strictEqual(actual.isInputSpecIsEmpty, expected.isInputSpecIsEmpty);
				assert.strictEqual(actual.isInputSpecIsStar, expected.isInputSpecIsStar);
				t.assert.snapshot(actual);
			});
		})

	});

})
