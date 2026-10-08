import assert from 'node:assert/strict';
import { test } from 'node:test';
import { basename, extname } from 'path';
import { npaToDepsValue } from '@yarn-tool/npa-to-deps';
import { queryDepsValueByNpaResult } from '../index';

[
	'jest@12',
	'jest@>12',
	'jest@<12',
	'jest@<=12',
	'jest@>=12',
	'jest@^12',
].forEach((input) =>
{

	test(input, async (t) =>
	{
		let depsResult = npaToDepsValue(input);

		let actual = await queryDepsValueByNpaResult(depsResult);

		console.dir({
			depsResult,
			actual,
		});

		assert.strictEqual(actual.name, depsResult.name);

		const operator = depsResult.operator ?? '';

		if (operator === '^')
		{
			assert.match(actual.value, /^\^\d+/);
		}
		else
		{
			assert.ok(actual.value.includes(`${operator}${depsResult.semver}`));
		}

		t.assert.snapshot(actual);

	});

});
