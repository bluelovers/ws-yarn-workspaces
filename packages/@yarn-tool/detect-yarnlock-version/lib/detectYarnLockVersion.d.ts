/// <reference types="node" />
export declare enum EnumDetectYarnLock {
    v1 = 1,
    v2 = 2,
    berry = 2,
    unknown = 0
}
export declare function detectYarnLockVersion(buf: Buffer | string): EnumDetectYarnLock;
export default detectYarnLockVersion;
