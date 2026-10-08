import assert from 'node:assert/strict';
import { it } from 'node:test';
import { parseWorkspaces, parseStaticPackagesPaths } from 'workspaces-config';
import { searchWorkspacePrefixByName } from '..';

const data = [
	"packages/@yarn-tool/*",
	"packages/*",
]

const workspacesConfig = parseStaticPackagesPaths(data)

it('should searchWorkspacePrefixByName', function (t)
{

	let actual = searchWorkspacePrefixByName({
		inputName: '@yarn-tool/kkk',
		workspacesConfig,
	})

	assert.deepStrictEqual(actual, 'packages/@yarn-tool')
	t.assert.snapshot(actual);

	actual = searchWorkspacePrefixByName({
		inputName: 'kkk',
		workspacesConfig,
	})

	assert.deepStrictEqual(actual, 'packages')
	t.assert.snapshot(actual);

});
