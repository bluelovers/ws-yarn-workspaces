/// <reference types="node" />
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
export declare function _detectYarnLockVersionSimple(buf: Buffer | string): EnumDetectYarnLock;
export declare function detectYarnLockVersion(buf: Buffer | string): EnumDetectYarnLock;
/**
 * only check v2 and v3
 */
export declare function _tryParse(buf: Buffer | string): EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
export declare function _tryParseObject(yarnLockObject: Record<string, any>): EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3;
export default detectYarnLockVersion;
