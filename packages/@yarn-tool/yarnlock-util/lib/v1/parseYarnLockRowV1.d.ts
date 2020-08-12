import { IYarnLockDataRowV1 } from '@yarn-tool/yarnlock-parse/index';
import { IParseNameAndVersion } from '../types';
export declare function parseYarnLockRowV1(packageName: string, packageData: IYarnLockDataRowV1): IParseNameAndVersion;
