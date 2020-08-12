import { parse } from '@yarnpkg/lockfile';
import { detectYarnLockVersion } from '@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion';
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/lib/types';
import { parseSyml } from '@yarnpkg/parsers';
import { IDependency } from '@ts-type/package-dts/lib/package-json/types';

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
		type?: string | 'success'
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

export function yarnLockParse<T extends IYarnLockParsedV1 | IYarnLockParsedV2 = IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_old: Buffer | string): T
{
	let verType = detectYarnLockVersion(yarnlock_old as string);
	let data;
	let meta;

	switch (verType)
	{
		case EnumDetectYarnLock.berry:
			({ __metadata: meta, ...data } = parseSyml(yarnlock_old.toString()));

			break;
		case EnumDetectYarnLock.v1:
			({ object: data, ...meta } = parse(yarnlock_old.toString()));

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

export function isYarnLockParsedV1<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV1>>(data): data is IYarnLockParsedV1<T>
{
	return (data as IYarnLockParsedV1).verType === EnumDetectYarnLock.v1
}

export function isYarnLockParsedV2<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV2>>(data): data is IYarnLockParsedV2<T>
{
	return (data as IYarnLockParsedV2).verType === EnumDetectYarnLock.v2
}

export default yarnLockParse
