import { IYarnLockDataRowV2 } from '@yarn-tool/yarnlock-parse/index';
import { IParseNameAndVersion } from '../types';
export declare function parseYarnLockRowV2(packageName: string, packageData: IYarnLockDataRowV2): IParseNameAndVersion;
