import { basename, extname } from 'path';
import { findRootLazy } from '@yarn-tool/find-root';
import { _findWorkspacesRootPath, listChangelog } from '../index';

const cwd = _findWorkspacesRootPath();

test(`listChangelog.length > 0`, () =>
{

	let actual = listChangelog(cwd);

	expect(actual.length).toBeGreaterThanOrEqual(1);

});
