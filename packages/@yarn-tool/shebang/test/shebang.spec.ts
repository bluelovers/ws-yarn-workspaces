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

			test(`${inspect(prop)} => ${expected}`, () =>
			{
				let actual: unknown;

				actual = shebang(prop);

				expect(actual).toStrictEqual(expected);

				actual = matchShebang(prop);

				expect(actual).toHaveProperty('bin', _prop.split(' ')[0])

				expect(actual).toMatchSnapshot();

				expect(removeShebang(prop)).not.toMatch(reShebang);

				expect(removeShebang(prop)).toMatchSnapshot();
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

			expect(actual).toBeUndefined();

			actual = matchShebang(prop);

			expect(actual).toBeUndefined();
		})
	}
})
