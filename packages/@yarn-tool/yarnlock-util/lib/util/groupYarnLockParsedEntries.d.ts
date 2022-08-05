import { IParseNameAndVersionWithNpaResult } from '../types';
import { IComputedPackageEntries } from './reduceYarnLockParsedEntries';
import { IYarnLockDataRowV1, IYarnLockDataRowV2, IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
export interface IGroupYarnLockParsedEntriesOptions {
    names?: string[];
}
export declare function groupYarnLockParsedEntries<R extends IYarnLockDataRowV1 | IYarnLockDataRowV2 = IYarnLockDataRowV1 | IYarnLockDataRowV2>(parsedOldPackage: IYarnLockParsedV1 | IYarnLockParsedV2, options?: IGroupYarnLockParsedEntriesOptions): IComputedPackageEntries<IParseNameAndVersionWithNpaResult>;
