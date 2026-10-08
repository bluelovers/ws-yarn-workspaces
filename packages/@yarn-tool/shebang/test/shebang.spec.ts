import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import shebang, { matchShebang, removeShebang, reShebang } from '../';
import { inspect } from 'util';

const data = {
	"/usr/bin/ruby": "ruby",
	"/usr/bin/env node": "node",
	"/usr/bin/env python -c": "python",
	"/bin/sh": "sh",
	"/usr/awk -f": "awk",
	"/bin/sed -f": "sed",
	"/usr/bin/php": "php",
	"/usr/bin/php5": "php5",
};

describe(`shebang`, () =>
{
	for (const _prop in data)
	{
		const expected = data[_prop];

		[
			`#!${_prop}`,
			`#! ${_prop}`,

			`\n\n#!${_prop}\n\n`,
			`\n\n#! ${_prop}\n\n`,

			`\n\n#!${_prop}`,
			`\n\n#! ${_prop}`,

			`#!${_prop}\n\n`,
			`#! ${_prop}\n\n`,
		].forEach((prop, index) => {

			test(`${inspect(prop)} => ${expected}`, (t) =>
			{
				let actual: unknown;

				actual = shebang(prop);

				assert.deepStrictEqual(actual, expected);

				actual = matchShebang(prop);

				assert.strictEqual((actual as any).bin, _prop.split(' ')[0])

				t.assert.snapshot(actual);

				assert.doesNotMatch(removeShebang(prop), reShebang);

				t.assert.snapshot(removeShebang(prop));
			})

		})
		;

	}
});

describe(`should not found`, () =>
{
	for (const prop in data)
	{
		test(`${inspect(prop)}`, () =>
		{
			let actual: unknown;

			actual = shebang(prop);

			assert.strictEqual(actual, undefined);

			actual = matchShebang(prop);

			assert.strictEqual(actual, undefined);
		})
	}
})
