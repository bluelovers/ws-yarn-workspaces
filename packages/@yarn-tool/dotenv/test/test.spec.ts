import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findRootLazy } from '@yarn-tool/find-root';
import { wsEnvConfig } from '../index';

test(`test`, () =>
{
	const rootData = findRootLazy();

	let actual = wsEnvConfig();

	assert.ok(actual.error !== null && actual.error !== undefined);
	assert.ok(actual.path.includes('.env'));
	assert.strictEqual(typeof actual.cwd, 'string');
	assert.strictEqual(actual.current, rootData.root);
	assert.strictEqual(typeof actual.fileExists, 'boolean');

});
