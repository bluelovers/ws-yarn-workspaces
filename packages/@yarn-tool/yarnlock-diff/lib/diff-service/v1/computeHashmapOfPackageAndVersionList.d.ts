import { IPackageData } from './types';
import { IComputedPackage } from '../types';
export declare const PACKAGE_REGEX: RegExp;
export declare function computeHashmapOfPackageAndVersionList(alreadyComputedPackage: IComputedPackage, parsedOldPackage: Record<string, IPackageData>): IComputedPackage;
