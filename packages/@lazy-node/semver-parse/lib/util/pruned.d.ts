import { ISimpleSemVer } from '../types';
/**
 * Returns a new object with all of the undefined properties removed from the given object
 */
export declare function pruned<T>(obj: T, o?: T): T;
export declare function prunedSimpleSemVer<T extends ISimpleSemVer>(obj: T, o?: T): T;
export default prunedSimpleSemVer;
