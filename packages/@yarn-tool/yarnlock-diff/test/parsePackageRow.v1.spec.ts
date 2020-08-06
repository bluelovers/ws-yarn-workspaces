import { parsePackageRow } from '../lib/diff-service/v1/parsePackageRow';

test(`@babel/parser@next`, () =>
{

	let actual = parsePackageRow('@babel/parser@next', {
		version: '1.0.0',
	} as any);

	expect(actual).toHaveProperty('name', '@babel/parser');
	expect(actual).toMatchSnapshot();

});

test(`@babel/parser@*`, () =>
{

	let actual = parsePackageRow('@babel/parser@*', {
		version: '1.0.0',
	} as any);

	expect(actual).toHaveProperty('name', '@babel/parser');
	expect(actual).toMatchSnapshot();

});
