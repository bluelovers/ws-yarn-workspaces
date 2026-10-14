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

	let snap = await actual.tarball();

	snap = {
		...snap,
		size: '<number>' as any,
		unpackedSize: '<number>' as any,
		shasum: '<string>' as any,
		integrity: '<string:sha512-...>' as any,
	};

	snap.files = snap.files.map((file) =>
	({
		...file,
		size: '<number>' as any,
	}));

	t.assert.snapshot(snap);

});
