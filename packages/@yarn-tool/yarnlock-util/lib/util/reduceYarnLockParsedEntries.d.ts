import { IYarnLockDataRowV1, IYarnLockDataRowV2, IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-parse';
export interface IComputedPackageEntries<T> {
    [packageName: string]: [key: string, data: T][];
}
export declare function reduceYarnLockParsedEntries<T, R extends IYarnLockDataRowV1 | IYarnLockDataRowV2 = IYarnLockDataRowV1 | IYarnLockDataRowV2>(alreadyComputedPackage: T, parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, fn: (alreadyComputedPackage: T, row: [key: string, packageData: R], index: number, parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2) => T): T;
