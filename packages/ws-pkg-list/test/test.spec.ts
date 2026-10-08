import { wsPkgListable, globFilterListable } from '..';
import { name } from '../package.json';
import assert from 'node:assert/strict';
import { test } from 'node:test';

test(`wsPkgListable`, () =>
{

	let actual = wsPkgListable();
	let expected;

	// 至少一個元素需同時符合各欄位型別（等效於 arrayContaining + objectContaining + any）
	assert.ok(actual.some(v =>
		typeof v.name === 'string'
		&& typeof v.version === 'string'
		&& typeof v.private === 'boolean'
		&& typeof v.location === 'string',
	));

});


test(`globFilterListable`, () =>
{
	let listable = wsPkgListable();

	let actual = globFilterListable(listable, name);
	let expected;

	assert.strictEqual(actual.length, 1)
	assert.ok(actual.length < listable.length)

	// 至少一個元素需同時符合各欄位型別（等效於 arrayContaining + objectContaining + any）
	assert.ok(actual.some(v =>
		typeof v.name === 'string'
		&& typeof v.version === 'string'
		&& typeof v.private === 'boolean'
		&& typeof v.location === 'string',
	));

	assert.strictEqual(actual[0].name, name)

});