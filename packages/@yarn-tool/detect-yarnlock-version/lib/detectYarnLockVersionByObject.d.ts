import { EnumDetectYarnLock } from './types';
export declare function detectYarnLockVersionByObject(yarnLockObject: Record<string, any>): EnumDetectYarnLock;
export declare function checkV2(obj: any): EnumDetectYarnLock;
export declare function checkV1(obj: any): EnumDetectYarnLock;
export default detectYarnLockVersionByObject;
