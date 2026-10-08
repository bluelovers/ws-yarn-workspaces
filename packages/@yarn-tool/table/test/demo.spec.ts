import { test } from 'node:test';
import { createDependencyTable } from '..';

test(`createDependencyTable`, (t) =>
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
	t.assert.snapshot(table);

	t.assert.snapshot(table.toString());

});

