import { parse } from '@yarnpkg/lockfile';
import { detectYarnLockVersion } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion';
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/lib/types';
import { parseSyml } from '@yarnpkg/parsers';
import { IDependency } from '@ts-type/package-dts/lib/package-json/types';
import newYarnLockParsedVersionError from '@yarn-tool/yarnlock-error';

export type IYarnLockParsed = IYarnLockParsedV1 | IYarnLockParsedV2;

export interface IYarnLockDataRowBase
{
	version: string

	[p: string]: unknown
}

export interface IYarnLockDataRow extends IYarnLockDataRowBase
{

}

export interface IYarnLockDataRowV1 extends IYarnLockDataRow
{
	resolved?: string,
	integrity?: string,
	dependencies?: IDependency,
	object?: Record<string, IYarnLockDataRowV1>,
}

export interface IYarnLockDataRowV2 extends IYarnLockDataRow
{
	resolution: string,
	dependencies?: IDependency,
	checksum?: string,
	languageName?: string | 'node',
	linkType?: string | 'hard',
}

export interface IYarnLockDataRecordBase<D extends IYarnLockDataRowBase>
{
	[key: string]: D
}

export type IYarnLockDataRecord<D extends IYarnLockDataRowBase = IYarnLockDataRow> = IYarnLockDataRecordBase<D>

export interface IYarnLockParsedV1<D extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV1>>
{
	verType: EnumDetectYarnLock.v1,
	meta?: {
		type?: string | 'success' | 'merge' | 'conflict'
		version?: never,
	},
	data: D,
}

export interface IYarnLockParsedV2<D extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV2>>
{
	verType: EnumDetectYarnLock.berry,
	meta?: {
		type?: never
		version?: string,
	},
	data: D,
}

export type IUnpackYarnLockDataRow<T extends IYarnLockParsedV1 | IYarnLockParsedV2> = T extends {
		data: IYarnLockDataRecord<infer D>,
	}
	? D extends IYarnLockDataRowV2
		? D
		: D extends IYarnLockDataRowV1
			? D
			: D extends IYarnLockDataRowBase
				? D
				: never
	: never
	;

export interface IYarnLockSourceV1
{
	type?: 'success' | 'merge' | 'conflict';
	object: IYarnLockDataRecord<IYarnLockDataRowV1>;
}

export type IYarnLockSourceV2 = {
	__metadata?: {
		version?: string,
	}
} & IYarnLockDataRecord<IYarnLockDataRowV2>;

export type IYarnLockSource = IYarnLockSourceV1 | IYarnLockSourceV2;

export function yarnLockParse<T extends IYarnLockParsedV1 | IYarnLockParsedV2 = IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_old: Buffer | string): T
{
	let verType = detectYarnLockVersion(yarnlock_old as string);
	let data;
	let meta;

	switch (verType)
	{
		case EnumDetectYarnLock.berry:
			({ __metadata: meta, ...data } = parseSyml(yarnlock_old.toString()) as IYarnLockSourceV2);

			break;
		case EnumDetectYarnLock.v1:
			({ object: data, ...meta } = parse(yarnlock_old.toString()) as IYarnLockSourceV1);

			break;
		default:
			throw newYarnLockParsedVersionError()
	}

	return {
		verType,
		meta,
		data,
	} as any
}

export function isYarnLockParsedV1<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV1>>(data): data is IYarnLockParsedV1<T>
{
	return (data as IYarnLockParsedV1).verType === EnumDetectYarnLock.v1
}

export function isYarnLockParsedV2<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV2>>(data): data is IYarnLockParsedV2<T>
{
	return (data as IYarnLockParsedV2).verType === EnumDetectYarnLock.v2
}

interface IAssertYarnLockParsedIsSupportedCB<T extends IYarnLockParsedV1 | IYarnLockParsedV2>
{
	(verType: EnumDetectYarnLock.v1, parsedOldPackage: Extract<T, IYarnLockParsedV1>): any
	(verType: EnumDetectYarnLock.v2, parsedOldPackage: Extract<T, IYarnLockParsedV2>): any
	(verType: EnumDetectYarnLock, parsedOldPackage: T): any
}

export function assertYarnLockParsedIsSupported<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(parsedOldPackage: T, cb?: IAssertYarnLockParsedIsSupportedCB<T>): asserts parsedOldPackage is T
{
	if (isYarnLockParsedV1(parsedOldPackage))
	{
		return cb?.(EnumDetectYarnLock.v1, parsedOldPackage)
	}
	else if (isYarnLockParsedV2(parsedOldPackage))
	{
		return cb?.(EnumDetectYarnLock.v2, parsedOldPackage)
	}

	throw newYarnLockParsedVersionError()
}

export default yarnLockParse
