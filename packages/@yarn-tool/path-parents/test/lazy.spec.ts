import pathUpToWorkspaces from '../index';
import __ from 'lodash/fp/__';
import { join } from 'path';
import { findRootLazy } from '@yarn-tool/find-root';

describe(`describe`, () =>
{

	test(`test`, () =>
	{

		let actual = pathUpToWorkspaces(__dirname);

		expect(actual.length).toBeGreaterThan(2);

		actual = pathUpToWorkspaces(__dirname, {
			ignoreCurrentDirectory: true,
		});

		expect(actual.length).toBeGreaterThan(2);

	});

})

describe(`ws.root`, () =>
{
	let rootData = findRootLazy();
	let cwd = rootData.root;

	test(`test`, () =>
	{
		let actual = pathUpToWorkspaces(cwd);

		expect(actual.length).toStrictEqual(1);

		actual = pathUpToWorkspaces(cwd, {
			ignoreCurrentDirectory: true,
		});

		expect(actual.length).toStrictEqual(0);

	});

})
