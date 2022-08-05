import { parseSyml, stringifySyml } from '@yarnpkg/parsers';
import { IYarnLockRawSourceV2 } from '@yarn-tool/yarnlock-types';

declare module '@yarnpkg/parsers'
{
	function parseSyml<T extends IYarnLockRawSourceV2 = IYarnLockRawSourceV2>(source: string): T
	function parseSyml(source: string): IYarnLockRawSourceV2
}

export function parseYarnLockRawV2<T extends IYarnLockRawSourceV2 = IYarnLockRawSourceV2>(source: string | Buffer): T
{
	return parseSyml(source?.toString()) as any
}

export { parseYarnLockRawV2 as parseYarnLockRawV2Root }

export { stringifySyml as stringifyYarnLockRawV2 }