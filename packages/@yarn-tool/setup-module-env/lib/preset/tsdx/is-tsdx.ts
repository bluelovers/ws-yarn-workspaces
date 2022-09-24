import { IPackageJson } from '@ts-type/package-dts/package-json';
import { ISetupTsdxOptions } from './index';
import { EnumTsdx } from './const';

export function isTsdxPackage<P extends IPackageJson>(pkg: P, config?: ISetupTsdxOptions<P>)
{
	return pkg.keywords?.includes(EnumTsdx.keyword) && typeof pkg.exports?.['.'] === 'object'
}
