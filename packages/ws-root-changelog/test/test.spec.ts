import { basename, extname } from 'path';
import { findRootLazy } from '@yarn-tool/find-root';
import { _findWorkspacesRootPath, listChangelog } from '../index';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const cwd = _findWorkspacesRootPath();

test(`listChangelog.length > 0`, () =>
{

	let actual = listChangelog(cwd);

	assert.ok(actual.length >= 1);

});
