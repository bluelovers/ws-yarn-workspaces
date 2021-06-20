import { IYarnLockDataRowV2 } from '@yarn-tool/yarnlock-parse';
import { IParseNameAndVersion } from '../types';
export declare function parseYarnLockRowV2(packageName: string, packageData: IYarnLockDataRowV2): IParseNameAndVersion;
