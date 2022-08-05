import { IYarnLockMetaVersion } from '@yarn-tool/yarnlock-types';
export declare function getMetadataVersion(yarnLockObject: Record<string, any>): `${number}`;
export declare function _getMetadataVersionCore(__metadata: Record<string, any>): '4' | '5' | '6' | IYarnLockMetaVersion;
