import pathUpToWorkspaces from '../index';
import __ from 'lodash/fp/__';
import { join } from 'path';
import { findRootLazy } from '@yarn-tool/find-root';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe(`describe`, () =>
{

	test(`test`, () =>
	{

		let actual = pathUpToWorkspaces(__dirname);

		assert.ok(actual.length > 2);

		actual = pathUpToWorkspaces(__dirname, {
			ignoreCurrentDirectory: true,
		});

		assert.ok(actual.length > 2);

	});

})

describe(`ws.root`, () =>
{
	let rootData = findRootLazy();
	let cwd = rootData.root;

	test(`test`, () =>
	{
		let actual = pathUpToWorkspaces(cwd);

		assert.deepStrictEqual(actual.length, 1);

		actual = pathUpToWorkspaces(cwd, {
			ignoreCurrentDirectory: true,
		});

		assert.deepStrictEqual(actual.length, 0);

	});

})
