import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePackageRow } from '../lib/diff-service/v1/parsePackageRow';

test(`@babel/parser@next`, (t) =>
{

	let actual = parsePackageRow('@babel/parser@next', {
		version: '1.0.0',
	} as any);

	assert.strictEqual(actual.name, '@babel/parser');
	t.assert.snapshot(actual);

});

test(`@babel/parser@*`, (t) =>
{

	let actual = parsePackageRow('@babel/parser@*', {
		version: '1.0.0',
	} as any);

	assert.strictEqual(actual.name, '@babel/parser');
	t.assert.snapshot(actual);

});
