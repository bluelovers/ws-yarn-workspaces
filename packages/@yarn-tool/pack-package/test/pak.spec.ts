import { basename, dirname, extname } from 'path';
import { packPackage } from '../index';
import { resolvePackage } from '@yarn-tool/resolve-package';

test(`packPackage`, async () =>
{
	const packageDir = resolvePackage('@yarn-tool/script-lifecycle/test/res/pkg-a').pkgRoot;

	let actual = await packPackage({
		packageDir,
	});

	expect(actual).toMatchSnapshot({
		packageDir: expect.any(String),
		packageTarball: expect.any(String),
		pkg: expect.any(Object),
	});

	await actual.log();

	console.dir(await actual.tarball());

	expect(await actual.tarball()).toMatchSnapshot({
		tarFilePath: expect.any(String),
	});

});
