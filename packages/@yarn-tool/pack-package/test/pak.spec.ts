import { basename, dirname, extname } from 'path';
import { packPackage } from '../index';
import { resolvePackage } from '@yarn-tool/require-resolve';
import { test } from 'node:test';

test(`packPackage`, async (t) =>
{
	const packageDir = resolvePackage('@yarn-tool/script-lifecycle/test/res/pkg-a').pkgRoot;

	let actual = await packPackage({
		packageDir,
	});

	t.assert.snapshot(actual);

	await actual.log();

	console.dir(await actual.tarball());

	t.assert.snapshot(await actual.tarball());

});
