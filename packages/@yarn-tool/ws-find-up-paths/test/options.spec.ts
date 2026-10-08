//@noUnusedParameters:false

import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { handleOptions } from '../index';

before(async () =>
{

});

test(`ignoreCurrentPackage`, (t) =>
{

	let actual = handleOptions({
		ignoreCurrentPackage: true,
	});

	console.dir(actual);

	// 原為 toMatchSnapshot(baseExpectedRuntime)，matcher 物件（expect.any / expect.anything）改為逐欄斷言

	assert.ok(typeof actual.cwd === 'string');
	assert.ok(Array.isArray(actual.stopPath));
	assert.ok(typeof actual.opts.cwd === 'string');
	assert.ok(Array.isArray(actual.opts.stopPath));
	assert.ok(actual.path != null);
	assert.ok(typeof actual.rootData.cwd === 'string');
	assert.ok(typeof actual.rootData.pkg === 'string');
	assert.ok(typeof actual.rootData.ws === 'string');
	assert.ok(typeof actual.rootData.root === 'string');

	assert.strictEqual(actual.opts.ignoreCurrentPackage, true);
	assert.strictEqual(actual.opts.includeCurrentDirectory, false);

	/**
	 * TypeError: Converting circular structure to JSON
	 * remove path to avoid circular reference
	 */
	delete actual.path;
	t.assert.snapshot(actual);

});
