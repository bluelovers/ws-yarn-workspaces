import { sync } from 'cross-spawn-extra';
import { IPackageJson } from '@ts-type/package-dts';
import { PackageJsonLoader } from 'npm-package-json-loader';

export function initWithPreserveDeps({
	npmClient,
	cwd,
	args,
	old_pkg,
	pkg_file_path
}: {
	npmClient: string,
	cwd: string,
	args: string[],
	old_pkg: IPackageJson,
	pkg_file_path: string,
})
{
	const cp = sync(npmClient, args, {
		stdio: 'inherit',
		cwd,
		env: {
			FORCE_COLOR: "0",
			NO_COLOR: "1",
		}
	});

	if (!cp.error && old_pkg)
	{
		let pkg = new PackageJsonLoader(pkg_file_path);

		if (pkg.exists())
		{
			pkg.data.dependencies = old_pkg.dependencies;
			pkg.data.devDependencies = old_pkg.devDependencies;

			pkg.writeOnlyWhenLoaded();
		}
	}

	return { cp }
}

export default initWithPreserveDeps
