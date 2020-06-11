import { createDependencyTable } from '..';

test(`createDependencyTable`, () =>
{

	let table = createDependencyTable();

	table.options.colAligns = ['left', 'center', 'center', 'center'];
	table.options.head = [
		'package name',
		'old version(s)',
		'',
		'new version(s)',
	];

	//expect(actual).toStrictEqual(expected);
	//expect(actual).toBeInstanceOf(Date);
	expect(table).toMatchSnapshot();

	expect(table.toString()).toMatchSnapshot();

});

