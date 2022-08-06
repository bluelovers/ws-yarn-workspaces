import { IComputedPackage } from './types';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
export declare function computeHashmapOfPackageAndVersionList(alreadyComputedPackage: IComputedPackage, parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2): IComputedPackage;
