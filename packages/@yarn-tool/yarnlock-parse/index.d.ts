/// <reference types="node" />
import { EnumDetectYarnLock } from '@yarn-tool/detect-yarnlock-version/lib/types';
import { IDependency } from '@ts-type/package-dts/lib/package-json/types';
export declare type IYarnLockParsed = IYarnLockParsedV1 | IYarnLockParsedV2;
export interface IYarnLockDataRowBase {
    version: string;
    [p: string]: unknown;
}
export interface IYarnLockDataRow extends IYarnLockDataRowBase {
}
export interface IYarnLockDataRowV1 extends IYarnLockDataRow {
    resolved?: string;
    integrity?: string;
    dependencies?: IDependency;
    object?: Record<string, IYarnLockDataRowV1>;
}
export interface IYarnLockDataRowV2 extends IYarnLockDataRow {
    resolution: string;
    dependencies?: IDependency;
    checksum?: string;
    languageName?: string | 'node';
    linkType?: string | 'hard';
}
export interface IYarnLockDataRecordBase<D extends IYarnLockDataRowBase> {
    [key: string]: D;
}
export declare type IYarnLockDataRecord<D extends IYarnLockDataRowBase = IYarnLockDataRow> = IYarnLockDataRecordBase<D>;
export interface IYarnLockParsedV1<D extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV1>> {
    verType: EnumDetectYarnLock.v1;
    meta?: {
        type?: string | 'success' | 'merge' | 'conflict';
        version?: never;
    };
    data: D;
}
export interface IYarnLockParsedV2<D extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV2>> {
    verType: EnumDetectYarnLock.berry;
    meta?: {
        type?: never;
        version?: string;
    };
    data: D;
}
export declare type IUnpackYarnLockDataRow<T extends IYarnLockParsedV1 | IYarnLockParsedV2> = T extends {
    data: IYarnLockDataRecord<infer D>;
} ? D extends IYarnLockDataRowV2 ? D : D extends IYarnLockDataRowV1 ? D : D extends IYarnLockDataRowBase ? D : never : never;
export interface IYarnLockSourceV1 {
    type?: 'success' | 'merge' | 'conflict';
    object: IYarnLockDataRecord<IYarnLockDataRowV1>;
}
export declare type IYarnLockSourceV2 = {
    __metadata?: {
        version?: string;
    };
} & IYarnLockDataRecord<IYarnLockDataRowV2>;
export declare type IYarnLockSource = IYarnLockSourceV1 | IYarnLockSourceV2;
export declare function yarnLockParse<T extends IYarnLockParsedV1 | IYarnLockParsedV2 = IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_old: Buffer | string): T;
export declare function isYarnLockParsedV1<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV1>>(data: any): data is IYarnLockParsedV1<T>;
export declare function isYarnLockParsedV2<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV2>>(data: any): data is IYarnLockParsedV2<T>;
interface IAssertYarnLockParsedIsSupportedCB<T extends IYarnLockParsedV1 | IYarnLockParsedV2> {
    (verType: EnumDetectYarnLock.v1, parsedOldPackage: Extract<T, IYarnLockParsedV1>): any;
    (verType: EnumDetectYarnLock.v2, parsedOldPackage: Extract<T, IYarnLockParsedV2>): any;
    (verType: EnumDetectYarnLock, parsedOldPackage: T): any;
}
export declare function assertYarnLockParsedIsSupported<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(parsedOldPackage: T, cb?: IAssertYarnLockParsedIsSupportedCB<T>): asserts parsedOldPackage is T;
export default yarnLockParse;
