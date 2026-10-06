import { describe, it } from 'node:test';

import { findWorkspaceRoot } from 'find-yarn-workspace-root2/core';
import { Project as LernaProject } from '@lerna/project';
import { checkPaths, EnumCheckPaths } from '../lib/util';

describe(`lerna project`, () =>
{
	const root = findWorkspaceRoot(__dirname);
	const cwd = __dirname;

	it(`check workspace root`, (t) =>
	{
		const _project = new LernaProject(cwd);
		const rootPath: string = _project.rootPath;

		const actual = checkPaths({
			root,
			rootPath,
		});
		const expected = EnumCheckPaths.rootPath;

		t.assert.equal(actual, expected);
	});

});
