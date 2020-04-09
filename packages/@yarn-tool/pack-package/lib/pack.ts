/**
 * Created by user on 2020/4/9.
 */

import { IPackageJson } from '@ts-type/package-dts';
import packlist from 'npm-packlist';
import { CreateOptions, FileOptions, create } from 'tar';
import { realpathSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { getTarballName } from './util';

export function packTargetDirectory({
	packageDir,
	packageTarball,
}: {
	packageDir: string,
	packageTarball: string
})
{
	return packlist({ path: packageDir })
		.then(files =>
		{
			//console.dir(files)
			return create({
				prefix: 'package/',
				cwd: packageDir,
				file: packageTarball,
				gzip: true,
				portable: true,
				mtime: new Date("1985-10-26T08:15:00.000Z"),
			} as CreateOptions & FileOptions, files.map(f => `./${f}`))
		})
		;
}

export function packTargetPackage(options: {
	pkg?: IPackageJson,
	packageDir: string,
	packageTarball?: string,
	versionPrefix?: string,
})
{
	let { pkg, packageDir } = options;

	packageDir = realpathSync(packageDir);

	if (!pkg)
	{
		pkg = JSON.parse(readFileSync(join(options.packageDir, 'package.json')).toString())
	}

	let packageTarball = options.packageTarball || getTarballName(pkg, options.versionPrefix);

	packageTarball = resolve(packageDir, packageTarball);

	return packTargetDirectory({
		//...options,
		packageDir,
		packageTarball,
	})
		.then((ret) =>
		{
			//console.dir(ret)

			return {
				...options,
				pkg,
				packageDir,
				packageTarball,
			}
		})
}

export default packTargetPackage
