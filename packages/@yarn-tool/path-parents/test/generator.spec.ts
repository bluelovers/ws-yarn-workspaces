import pathUpToWorkspaces, { pathUpToWorkspacesGenerator } from '../index';
import { findRootLazy } from '@yarn-tool/find-root';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('pathUpToWorkspacesGenerator', () => {
  test('generator yields same list as array API (include current dir)', () => {
    const cwd = __dirname;
    const list = pathUpToWorkspaces(cwd);
    const genList = [...pathUpToWorkspacesGenerator(cwd)];

    assert.ok(genList.length > 0);
    assert.deepStrictEqual(genList, list);
  });

  test('generator respects ignoreCurrentDirectory option', () => {
    const cwd = __dirname;
    const list = pathUpToWorkspaces(cwd, { ignoreCurrentDirectory: true });
    const genList = [...pathUpToWorkspacesGenerator(cwd, { ignoreCurrentDirectory: true })];

    assert.ok(genList.length > 0);
    assert.deepStrictEqual(genList, list);
    // When ignoring current directory, first yielded path should not be cwd
    assert.notStrictEqual(genList[0], require('path').resolve(cwd));
  });

  test('last yielded path equals workspace root', () => {
    const rootData = findRootLazy();
    const cwd = __dirname;
    const genList = [...pathUpToWorkspacesGenerator(cwd)];

    assert.strictEqual(genList[genList.length - 1], rootData.root);
  });
});
