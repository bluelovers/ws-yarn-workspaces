/**
 * Created by user on 2020/6/13.
 */

import { existsSync, readFileSync } from 'fs-extra';
import { matchShebang } from '@yarn-tool/shebang';
import { IPackageJson } from '@ts-type/package-dts';
import { getPackageBins } from '@yarn-tool/get-pkg-bin';
import { join } from 'upath2';

export function hasShebang(buf: Buffer | string)
{
	return matchShebang(buf.toString())?.script?.length > 0
}

export function checkFile(file: string)
{
	if (existsSync(file))
	{
		return hasShebang(readFileSync(file))
	}
}

export function checkPkgJson(pkg: IPackageJson, cwd: string)
{
	return Object.entries(getPackageBins(pkg) ?? [])
		.reduce((a, row) =>
		{

			let filename = row[1];
			let file = join(cwd, filename);
			let bool = checkFile(file)

			a.push({
				file,
				filename,
				hasShebang: bool,
			})

			return a
		}, [] as {
			file: string,
			filename: string,
			hasShebang: boolean,
		}[])
}

