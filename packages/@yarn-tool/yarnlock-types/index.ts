import { IDependency } from '@ts-type/package-dts/lib/package-json/types';
import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';

export type IYarnLockParsed = IYarnLockParsedV1 | IYarnLockParsedV2;

/**
 * use for avoid typescript show error
 */
export interface IYarnLockParsedLoose<D extends IYarnLockDataRowBase = IYarnLockDataRowBase, K extends string = string>
{
	verType: EnumDetectYarnLock,
	meta?: Record<string, any>,
	data: IYarnLockDataRecord<D, K>,
}

export interface IYarnLockDataRowBase
{
	version: string
	/**
	 * 依賴列表
	 */
	dependencies?: IDependency,
}

export interface IYarnLockDataRowV1 extends IYarnLockDataRowBase
{
	/**
	 * 安裝來源網址
	 */
	resolved?: string,
	/**
	 * hash key
	 */
	integrity?: string,
}

export interface IYarnLockDataRowV2 extends IYarnLockDataRowBase
{
	resolution: string,
	checksum?: string,
	languageName?: string | ITSTypeAndStringLiteral<EnumLanguageName>,
	linkType?: string | ITSTypeAndStringLiteral<EnumLinkType>,
}

export type IYarnLockDataRecord<D extends IYarnLockDataRowBase = IYarnLockDataRowBase, K extends string = string> = Record<K, D>

export enum EnumDetectYarnLock
{
	v1 = 1,
	v2 = 2,
	/**
	 * @deprecated do not use this if u want check is version is berry
	 * @type {EnumDetectYarnLock.berry}
	 */
	berry = 2,
	v3 = 3,
	/**
	 * @deprecated do not use this if u want check is version is berry
	 * @alias {EnumDetectYarnLock.v3}
	 */
	canary = 3,
	unknown = 0,
}

export const enum EnumDetectYarnLockInputType
{
	unknown,
	simple,
	parse_raw,
}

export type IEnumDetectYarnLockValues = typeof EnumDetectYarnLock[keyof typeof EnumDetectYarnLock];
export type IValidYarnLockVersion = Exclude<IEnumDetectYarnLockValues, EnumDetectYarnLock.unknown>;
export type IYarnLockVersionSyml = Exclude<IValidYarnLockVersion, EnumDetectYarnLock.v1>;
export type IYarnLockMetaVersion = `${number}`

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
	verType: IYarnLockVersionSyml,
	meta?: {
		type?: never
		version?: string,
		cacheKey?: string,
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

export const enum EnumYarnLockSourceV1Type
{
	'success' = 'success',
	'merge' = 'merge',
	'conflict' = 'conflict',
}

/**
 * yarn.lock v1
 * @see @yarnpkg/lockfile
 */
export interface IYarnLockRawSourceV1
{
	type?: ITSTypeAndStringLiteral<EnumYarnLockSourceV1Type>;
	object: IYarnLockDataRecord<IYarnLockDataRowV1>;
}

export type IYarnLockRawSourceV1Full = Required<IYarnLockRawSourceV1>

/**
 * yarn.lock v2
 * @see @yarnpkg/parsers
 */
export type IYarnLockRawSourceV2 = {
	__metadata?: {
		version?: string,
		cacheKey?: string,
	}
} & IYarnLockDataRecord<IYarnLockDataRowV2>;

export type IYarnLockSource = IYarnLockRawSourceV1 | IYarnLockRawSourceV2;

export type IYarnLockRawSourceV2Full = Required<IYarnLockRawSourceV2>

export enum EnumLinkType
{
	'hard' = 'hard',
	'soft' = 'soft',
}

export enum EnumLanguageName
{
	'node' = 'node',
	'unknown' = 'unknown',
}
