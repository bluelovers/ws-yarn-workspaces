import { EnumDetectYarnLock, IYarnLockMetaVersion, IYarnLockVersionSyml } from '@yarn-tool/yarnlock-types';
export declare function detectYarnLockVersionByObject(yarnLockObject: Record<string, any>): EnumDetectYarnLock;
export declare function _checkV2Row(row: unknown): boolean;
/**
 * check v2 and v3
 */
export declare function checkV2(obj: any): EnumDetectYarnLock.unknown | IYarnLockVersionSyml;
export declare function checkV1(obj: any): EnumDetectYarnLock;
export declare function _checkExistsMetaCore(obj: unknown): {
    verType: EnumDetectYarnLock.unknown | IYarnLockVersionSyml;
    metaVersion: `${number}`;
    existsMeta: boolean;
    emptyEntries: boolean;
    existsEntries: boolean;
    onlyExistsMeta: boolean;
    meta: {
        version: IYarnLockMetaVersion;
    };
    entryKeys: string[];
};
export declare function checkExistsMeta(obj: unknown): obj is {
    __metadata: {
        version: IYarnLockMetaVersion;
    };
};
export default detectYarnLockVersionByObject;
