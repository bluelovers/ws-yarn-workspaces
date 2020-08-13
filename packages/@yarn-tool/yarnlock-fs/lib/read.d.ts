import { IFsYarnLockReturnType } from './types';
/**
 * @deprecated
 */
export declare function fsYarnLock(root: string): IFsYarnLockReturnType;
export declare function fsYarnLockSafe(root: string): IFsYarnLockReturnType;
export default fsYarnLockSafe;
