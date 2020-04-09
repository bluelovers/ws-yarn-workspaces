/**
 * Created by user on 2020/4/9.
 */

import { IPackageJson } from '@ts-type/package-dts';
import { packTargetPackage } from './lib/pack';
import { getPackedTarballInfo } from './lib/info';
import { printPackedTarballInfo } from './lib/print';
import { IPackedTarballInfo } from './lib/types';

export { packTargetPackage } from './lib/pack';

export { printPackedTarballInfo } from './lib/print';
export { getPackedTarballInfo } from './lib/info';

export function packPackage(options: {
	pkg?: IPackageJson,
	packageDir: string,
	packageTarball?: string,
	versionPrefix?: string,
})
{
	return packTargetPackage(options)
		.then(async (data) => {
			let tarball: IPackedTarballInfo;

			const object = Object.freeze({
				...data,
				async tarball()
				{
					return tarball ?? (tarball = await getPackedTarballInfo(data))
				},
				async log()
				{
					return printPackedTarballInfo(await object.tarball())
				},
			});

			return object
		})
}

export default packPackage
