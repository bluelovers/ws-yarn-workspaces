//@noUnusedParameters:false

import { _getNpaResult, normalizeDepsValue, normalizeResultToDepsValue } from '../index';
import { EnumSemverVersion } from '@lazy-node/semver-ampersand/lib/const';
import assert from 'node:assert/strict';
import { describe, test, before } from 'node:test';

before(async () =>
{

});

describe(`normalizeDepsValue`, () =>
{
	[
		'1.0 && (2.0    || 3.1)',
		'1.0 (2.0 || 3.1)',
		'>x 2.x || * || <x || ~1.2.3beta ^4.0.0-dev.20200615 && 4.0.0-dev.20200615 < 4.0.0-dev.20200800 || 4.0.x - 4.0.2 || (4.0.x - 4.0.2) || >= 1 || =1 || ~> 2.0.0 || 1.2.3 - 1.2.4 - 1.2.5 || >=1.2.3 <=1.2.4',
		'gitlab:user/foo-js',
		'gitlab:user/foo-js#bar/baz',
		'gitlab:user..blerg--/..foo-js# . . . . . some . tags / / /',
		'gitlab:user/foo-js#bar/baz/bin',
		'foo@gitlab:user/foo-js',
		'git+ssh://git@gitlab.com/user/foo#1.2.3',
		'https://gitlab.com/user/foo.git',
		'@foo/bar@git+ssh://gitlab.com/user/foo',
		'*',
		'',
		'x',
		'1',
		'0',
		' ',
		'.',
		'npm:bar@1.2',
		'npm:@foo/bar@1.2',
		'npm:@foo/bar@next',
	].forEach(input =>
	{
		test(input === EnumSemverVersion.ANY ? 'empty' : input === ' ' ? 'space' : input, (t) =>
		{

			let result = _getNpaResult(input);
			let actual = normalizeResultToDepsValue(result);

			// @ts-ignore
			assert.ok(result.fetchSpec !== null ? typeof result.fetchSpec === 'string' : result.fetchSpec === null);
			// @ts-ignore
			assert.ok(result.where ? typeof result.where === 'string' : result.where === void 0);
			t.assert.snapshot(result);
			t.assert.snapshot(actual);

		});
	})

})
