/// <reference types="node" />
import { describe, test } from 'node:test';
import { existsSync, readFileSync } from 'fs';
import { join, relative } from 'upath2';
import WorkspacesProject from '../index';

describe(`WorkspacesProject`, () =>
{
	const fixtures = join(__dirname, 'fixtures');
	const pnpmWorkspaceFile = join(fixtures, 'pnpm-workspace.yaml');

	test(`cwd => fixtures`, (t: test.TestContext) =>
	{
		const project = new WorkspacesProject(fixtures);

		t.assert.ok(project.rootPath.length > 0);
	});

});
