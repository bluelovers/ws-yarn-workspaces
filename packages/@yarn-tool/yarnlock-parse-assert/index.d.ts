import { EnumDetectYarnLock, IYarnLockDataRecord, IYarnLockDataRowBase, IYarnLockDataRowV1, IYarnLockDataRowV2, IYarnLockParsed, IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
export declare function isYarnLockParsed(parsedObject: IYarnLockParsed): parsedObject is IYarnLockParsed;
export declare function assertYarnLockParsed(parsedObject: IYarnLockParsed): asserts parsedObject is IYarnLockParsed;
export declare function isYarnLockParsedV1<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV1>>(data: any): data is IYarnLockParsedV1<T>;
export declare function isYarnLockParsedV2<T extends IYarnLockDataRecord<IYarnLockDataRowBase> = IYarnLockDataRecord<IYarnLockDataRowV2>>(data: any): data is IYarnLockParsedV2<T>;
interface IAssertYarnLockParsedIsSupportedCB<T extends IYarnLockParsedV1 | IYarnLockParsedV2> {
    (verType: EnumDetectYarnLock.v1, parsedOldPackage: Extract<T, IYarnLockParsedV1>): any;
    (verType: EnumDetectYarnLock.v2, parsedOldPackage: Extract<T, IYarnLockParsedV2>): any;
    (verType: EnumDetectYarnLock.v3, parsedOldPackage: Extract<T, IYarnLockParsedV2>): any;
    (verType: EnumDetectYarnLock, parsedOldPackage: T): any;
}
export declare function assertYarnLockParsedIsSupported<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(parsedOldPackage: T, cb?: IAssertYarnLockParsedIsSupportedCB<T>): asserts parsedOldPackage is T;
export default assertYarnLockParsed;
