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

export function parseYarnLockRawV1Root(source: string | Buffer,
	fileLoc?: string
)
{
	return parseYarnLockRawV1(source, fileLoc).object
}

export { stringify as stringifyYarnLockRawV1 }
