import { IDependency } from '@ts-type/package-dts/lib/package-json/types';
import { ITSTypeAndStringLiteral } from 'ts-type/lib/helper/string';
export declare type IYarnLockParsed = IYarnLockParsedV1 | IYarnLockParsedV2;
export interface IYarnLockDataRowBase {
    version: string;
    /**
     * 依賴列表
     */
    dependencies?: IDependency;
}
export interface IYarnLockDataRow extends IYarnLockDataRowBase {
}
export interface IYarnLockDataRowV1 extends IYarnLockDataRow {
    /**
     * 安裝來源網址
     */
    resolved?: string;
    /**
     * hash key
     */
    integrity?: string;
    object?: Record<string, IYarnLockDataRowV1>;
}
export interface IYarnLockDataRowV2 extends IYarnLockDataRow {
    resolution: string;
    checksum?: string;
    languageName?: string | ITSTypeAndStringLiteral<EnumLanguageName>;
    linkType?: string | ITSTypeAndStringLiteral<EnumLinkType>;
}
export declare type IYarnLockDataRecordBase<D extends IYarnLockDataRowBase, K extends string = string> = Record<K, D>;
export declare type IYarnLockDataRecord<D extends IYarnLockDataRowBase = IYarnLockDataRow> = IYarnLockDataRecordBase<D>;
export declare enum EnumDetectYarnLock {
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
    unknown = 0
}
export declare type IEnumDetectYarnLockValues = typeof EnumDetectYarnLock[keyof typeof EnumDetectYarnLock];
export declare type IValidYarnLockVersion = Exclude<IEnumDetectYarnLockValues, EnumDetectYarnLock.unknown>;
export declare type IYarnLockVersionSyml = Exclude<IValidYarnLockVersion, EnumDetectYarnLock.v1>;
export declare type IYarnLockMetaVersion = `${number}`;
export interface IYarnLockParsedV1<D extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV1>> {
    verType: EnumDetectYarnLock.v1;
    meta?: {
        type?: string | 'success' | 'merge' | 'conflict';
        version?: never;
    };
    data: D;
}
export interface IYarnLockParsedV2<D extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV2>> {
    verType: IYarnLockVersionSyml;
    meta?: {
        type?: never;
        version?: string;
        cacheKey?: string;
    };
    data: D;
}
export declare type IUnpackYarnLockDataRow<T extends IYarnLockParsedV1 | IYarnLockParsedV2> = T extends {
    data: IYarnLockDataRecord<infer D>;
} ? D extends IYarnLockDataRowV2 ? D : D extends IYarnLockDataRowV1 ? D : D extends IYarnLockDataRowBase ? D : never : never;
export declare const enum EnumYarnLockSourceV1Type {
    'success' = "success",
    'merge' = "merge",
    'conflict' = "conflict"
}
/**
 * yarn.lock v1
 * @see @yarnpkg/lockfile
 */
export interface IYarnLockRawSourceV1 {
    type?: ITSTypeAndStringLiteral<EnumYarnLockSourceV1Type>;
    object: IYarnLockDataRecord<IYarnLockDataRowV1>;
}
export declare type IYarnLockRawSourceV1Full = Required<IYarnLockRawSourceV1>;
/**
 * yarn.lock v2
 * @see @yarnpkg/parsers
 */
export declare type IYarnLockRawSourceV2 = {
    __metadata?: {
        version?: string;
        cacheKey?: string;
    };
} & IYarnLockDataRecord<IYarnLockDataRowV2>;
export declare type IYarnLockSource = IYarnLockRawSourceV1 | IYarnLockRawSourceV2;
export declare type IYarnLockRawSourceV2Full = Required<IYarnLockRawSourceV2>;
export declare enum EnumLinkType {
    'hard' = "hard",
    'soft' = "soft"
}
export declare enum EnumLanguageName {
    'node' = "node",
    'unknown' = "unknown"
}
