'use strict';

import findWorkspaceRoot from '../core';

import path from 'upath2';

import cp from 'child_process';

describe('findWorkspaceRoot', () =>
{
	let fixtureDirectory = path.resolve(__dirname, './fixtures');

	const tests = [
		{
			description: 'normal yarn project',
			baseDir: path.join(fixtureDirectory, 'normal-yarn-project'),
			expectedResult: null,
		},
		{
			description: 'not a yarn project',
			baseDir: path.join(fixtureDirectory, 'not-yarn'),
			expectedResult: null,
		},
		{
			description: 'yarn workspace root',
			baseDir: path.join(fixtureDirectory, 'yarn-workspace'),
			expectedResult: path.join(fixtureDirectory, 'yarn-workspace'),
		},
		{
			description: 'package-a in yarn workspace root',
			baseDir: path.join(fixtureDirectory, 'yarn-workspace', 'package-a'),
			expectedResult: path.join(fixtureDirectory, 'yarn-workspace'),
		},
		{
			description: 'package-b in yarn workspace root',
			baseDir: path.join(fixtureDirectory, 'yarn-workspace', 'package-b'),
			expectedResult: path.join(fixtureDirectory, 'yarn-workspace'),
		},
		{
			description: 'package not listed in yarn workspace root',
			baseDir: path.join(fixtureDirectory, 'yarn-workspace', 'not-in-workspace'),
			expectedResult: null,
		},
		{
			description: 'yarn workspace root without a lockfile',
			baseDir: path.join(fixtureDirectory, 'yarn-workspace-no-lockfile'),
			expectedResult: path.join(fixtureDirectory, 'yarn-workspace-no-lockfile'),
		},
		{
			description: 'yarn workspace root - object config format',
			baseDir: path.join(fixtureDirectory, 'yarn-workspace-object-config'),
			expectedResult: path.join(fixtureDirectory, 'yarn-workspace-object-config'),
		},
		{
			description: 'package-a in yarn workspace root - object config format',
			baseDir: path.join(fixtureDirectory, 'yarn-workspace-object-config', 'package-a'),
			expectedResult: path.join(fixtureDirectory, 'yarn-workspace-object-config'),
		},
		{
			description: 'package not listed in yarn workspace root - object config format',
			baseDir: path.join(fixtureDirectory, 'yarn-workspace-object-config-no-packages', 'package-a'),
			expectedResult: null,
		},
		{
			description: 'sub path of package-a in yarn workspace root',
			baseDir: path.join(fixtureDirectory, 'yarn-workspace', 'package-a', 'sub-path'),
			expectedResult: path.join(fixtureDirectory, 'yarn-workspace'),
		},
	];

	tests.forEach(item =>
	{
		const description = item.description;
		const baseDir = item.baseDir;
		const expectedResult = item.expectedResult;

		it(description, () =>
		{
			let actual = findWorkspaceRoot(baseDir);
			expect(actual).toStrictEqual(expectedResult);
		});
	});

	it('uses process.cwd() as a default path', () =>
	{
		const dummyBinPath = require.resolve('./fixtures/bin/cwd-find-root');
		const workspaceRoot = path.join(fixtureDirectory, 'yarn-workspace-default-path');
		const execOptions = {
			cwd: path.join(workspaceRoot, 'package-a'),
			encoding: 'utf8',
		};
		const result = cp.execFileSync(process.execPath, [dummyBinPath], execOptions as any);
		expect(result).toBe(workspaceRoot);
	});
});
