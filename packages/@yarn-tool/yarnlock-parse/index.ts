import { parse } from '@yarnpkg/lockfile';
import { detectYarnLockVersion } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion';
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/lib/types';
import { parseSyml } from '@yarnpkg/parsers';

export interface IYarnLockParseV1<D extends Record<string, any> = Record<string, any>>
{
	verType: EnumDetectYarnLock.v1,
	meta?: {
		type?: string
	},
	data: D,
}

export interface IYarnLockParseV2<D extends Record<string, any> = Record<string, any>>
{
	verType: EnumDetectYarnLock.berry,
	meta?: {
		version?: string,
	},
	data: D,
}

export function yarnLockParse(yarnlock_old: Record<string, any> | Buffer | string): IYarnLockParseV1 | IYarnLockParseV2
{
	let verType = detectYarnLockVersion(yarnlock_old as string);
	let data;
	let meta;

	switch (verType)
	{
		case EnumDetectYarnLock.berry:
			({ __metadata: meta, ...data } = parseSyml(yarnlock_old as any as string));

			break;
		case EnumDetectYarnLock.v1:
			({ object: data, ...meta } = parse(yarnlock_old as any as string));

			break;
		default:
			throw new TypeError(`can't detect yarn.lock`)
	}

	return {
		verType,
		meta,
		data,
	} as any
}

export function isYarnLockParseV1<T extends Record<string, any>>(data): data is IYarnLockParseV1<T>
{
	return (data as IYarnLockParseV1).verType === EnumDetectYarnLock.v1
}

export function isYarnLockParseV2<T extends Record<string, any>>(data): data is IYarnLockParseV2<T>
{
	return (data as IYarnLockParseV2).verType === EnumDetectYarnLock.v2
}

export default yarnLockParse
