import { getMetadataVersion } from './util';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
export declare function detectYarnLockVersionWithMetadata(yarnLockObject: Record<string, any>): EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3 | EnumDetectYarnLock.unknown;
export declare function _detectYarnLockVersionWithMetadataCore(metaVersion: string | ReturnType<typeof getMetadataVersion>): EnumDetectYarnLock.v2 | EnumDetectYarnLock.v3 | EnumDetectYarnLock.unknown;
