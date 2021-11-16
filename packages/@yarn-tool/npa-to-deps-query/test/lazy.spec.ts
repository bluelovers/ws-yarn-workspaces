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

	test(input, async () =>
	{
		let depsResult = npaToDepsValue(input);

		let actual = await queryDepsValueByNpaResult(depsResult);

		console.dir({
			depsResult,
			actual,
		});

		expect(actual).toHaveProperty('name', depsResult.name);

		const operator = depsResult.operator ?? '';

		if (operator === '^')
		{
			expect(actual.value).toMatch(/^\^\d+/);
		}
		else
		{
			expect(actual.value).toContain(`${operator}${depsResult.semver}`);
		}

		expect(actual).toMatchSnapshot();

	});

});
