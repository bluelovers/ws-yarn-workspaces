/// <reference types="node" />
import { EnumDetectYarnLock, EnumDetectYarnLockInputType } from '@yarn-tool/yarnlock-types';
export declare function _detectYarnLockVersionSimple(buf: Buffer | string): EnumDetectYarnLock;
export declare function _detectYarnLockVersionCore<T extends Buffer | string>(input: T): {
    verType: EnumDetectYarnLock.v1 | EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
    detectType: EnumDetectYarnLockInputType.simple;
    input: T;
} | {
    verType: EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
    detectType: EnumDetectYarnLockInputType.parse_raw;
    input: T;
} | {
    verType: EnumDetectYarnLock.unknown;
    detectType: EnumDetectYarnLockInputType.unknown;
    input: T;
};
export declare function detectYarnLockVersion(buf: Buffer | string): EnumDetectYarnLock;
/**
 * only check v2 and v3
 */
export declare function _tryParse(buf: Buffer | string): EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
export declare function _tryParseObject(yarnLockObject: Record<string, any>): EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
export default detectYarnLockVersion;
