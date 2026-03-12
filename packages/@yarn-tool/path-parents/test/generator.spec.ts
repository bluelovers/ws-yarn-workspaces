import pathUpToWorkspaces, { pathUpToWorkspacesGenerator } from '../index';
import { findRootLazy } from '@yarn-tool/find-root';

describe('pathUpToWorkspacesGenerator', () => {
  test('generator yields same list as array API (include current dir)', () => {
    const cwd = __dirname;
    const list = pathUpToWorkspaces(cwd);
    const genList = [...pathUpToWorkspacesGenerator(cwd)];

    expect(genList.length).toBeGreaterThan(0);
    expect(genList).toEqual(list);
  });

  test('generator respects ignoreCurrentDirectory option', () => {
    const cwd = __dirname;
    const list = pathUpToWorkspaces(cwd, { ignoreCurrentDirectory: true });
    const genList = [...pathUpToWorkspacesGenerator(cwd, { ignoreCurrentDirectory: true })];

    expect(genList.length).toBeGreaterThan(0);
    expect(genList).toEqual(list);
    // When ignoring current directory, first yielded path should not be cwd
    expect(genList[0]).not.toBe(require('path').resolve(cwd));
  });

  test('last yielded path equals workspace root', () => {
    const rootData = findRootLazy();
    const cwd = __dirname;
    const genList = [...pathUpToWorkspacesGenerator(cwd)];

    expect(genList[genList.length - 1]).toBe(rootData.root);
  });
});
