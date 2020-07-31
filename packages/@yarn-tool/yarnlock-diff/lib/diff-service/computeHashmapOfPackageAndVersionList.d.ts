import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-parse/index';
import { IComputedPackage } from './types';
export declare function computeHashmapOfPackageAndVersionList(alreadyComputedPackage: IComputedPackage, parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2): IComputedPackage;
