/**
 * Created by user on 2020/4/9.
 */

import { getPacked } from '@lerna/get-packed';
import { IPackageJson } from '@ts-type/package-dts';
import { IPackedTarballInfo } from './types';

export async function getPackedTarballInfo(options: {
	pkg: IPackageJson,
	packageTarball: string,
})
{
	return getPacked(options.pkg, options.packageTarball) as IPackedTarballInfo
}

export default getPackedTarballInfo
