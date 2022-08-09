import { parse, stringify } from '@yarnpkg/lockfile';
import { IYarnLockRawSourceV1, IYarnLockRawSourceV1Full } from '@yarn-tool/yarnlock-types';

declare module '@yarnpkg/lockfile'
{
	function parse<T extends IYarnLockRawSourceV1Full = IYarnLockRawSourceV1Full>(source: string, fileLoc?: string): T;
	function parse(source: string, fileLoc?: string): IYarnLockRawSourceV1Full;
}

export function parseYarnLockRawV1<T extends IYarnLockRawSourceV1Full = IYarnLockRawSourceV1Full>(source: string | Buffer, fileLoc?: string): T
{
	return parse(source?.toString(), fileLoc)
}

export function getYarnLockRawV1Root(input: IYarnLockRawSourceV1)
{
	if (!('object' in input))
	{
		throw new TypeError(`'object' key not exists in input object`)
	}
	return input.object
}

export function parseYarnLockRawV1Root(source: string | Buffer,
	fileLoc?: string
)
{
	return getYarnLockRawV1Root(parseYarnLockRawV1(source, fileLoc))
}

export function stringifyYarnLockRawV1(json: any, noHeader?: boolean)
{
	return stringify((json as IYarnLockRawSourceV1).object ?? json, noHeader)
}
