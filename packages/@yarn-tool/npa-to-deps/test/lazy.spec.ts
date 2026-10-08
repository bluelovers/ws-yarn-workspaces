import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { basename, extname } from 'path';
import { npaToDepsValue } from '../index';
import { parseSimpleSemVerRange } from '@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange';
import { _actualNpaToDepsValue } from './lb/util';

describe(`should return semver`, () =>
{

	[
		'botkit@jonchurch/botkit#multi-hears',
		'botkit@12',
		'botkit@github:jonchurch/botkit#multi-hears',
	].forEach((input) =>
	{

		test(input, (t) =>
		{
			let actual = _actualNpaToDepsValue(input);

			t.assert.snapshot(actual);

			assert.ok(actual.depsResult.semver.length >= 1);

			assert.strictEqual(typeof actual.depsResult.semver, 'string');
		});

	});

});

describe(`should return undefined`, () =>
{

	[
		'botkit',
		'botkit@^12',
	].forEach((input) =>
	{

		test(input, (t) =>
		{

			let actual = _actualNpaToDepsValue(input);

			t.assert.snapshot(actual);

			/*
			 * 原 `expect(actual.depsResult).toMatchSnapshot({ semver: void 0, fetchQuery: true })`
			 * 的 property matchers 在 node:test 無對應 API，改以等效斷言表達：
			 * The property matchers of the original snapshot call have no node:test
			 * equivalent; expressed as equivalent assertions below.
			 */
			assert.strictEqual(actual.depsResult.semver, void 0);
			assert.strictEqual(actual.depsResult.fetchQuery, true);
			t.assert.snapshot(actual.depsResult);

		});

	});

});

describe(`alias`, () =>
{

	[
		'botkit@npm:foo',
		'botkit@npm:foo@next',
		'botkit@npm:foo@12',
		'botkit@npm:foo@^12',
	].forEach((input) =>
	{

		test(input, (t) =>
		{

			let actual = npaToDepsValue(input);

			t.assert.snapshot(actual);

		});

	});

});
