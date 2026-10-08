import parseSimpleSemVer from '../lib/parseSimpleSemVer';
import { isSimpleSemVerObjectLike, hasOperator, assertSimpleSemVerObjectLike } from '../lib/checker';
import { stringifySemverFull } from '../lib/stringifySimpleSemVer';
import { _lazyReturnResultAll } from './lib/util';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe(`parseSimpleSemVer`, () =>
{

	test(`^4.0.0-dev.20200615`, (t) =>
	{
		let version = `^4.0.0-dev.20200615`;

		let actual = parseSimpleSemVer(version);

		assert.ok(isSimpleSemVerObjectLike(actual));
		assert.ok(hasOperator(actual));

		assert.deepStrictEqual(stringifySemverFull(actual), version);

		t.assert.snapshot(actual);

		t.assert.snapshot(_lazyReturnResultAll(version));

	});

	[
		`4.0.0-dev.20200615`,
		`12.0.0`,
		`12.0`,
		`12`,
		`12.x`,
		`12.0.x`,
		`12.x.0`,
	].forEach(version => {
		test(version, (t) =>
		{
			let actual = _lazyReturnResultAll(version);

			t.assert.snapshot(actual);

			assert.strictEqual(typeof actual.parseSimpleSemVer.result.major, 'string');
			assert.ok(actual.parseSimpleSemVerRange.result.some(
				v => typeof v.major === 'string',
			));
		});
	})

})