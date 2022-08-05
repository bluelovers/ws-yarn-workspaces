import { YarnLockIterator } from './YarnLockIterator';
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
export declare function handleContentObject<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(data: T): YarnLockIterator<T, import("@yarn-tool/yarnlock-types").IUnpackYarnLockDataRow<T>>;
export declare function handleContentObjectAsync<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(data: T): Promise<YarnLockIterator<T, import("@yarn-tool/yarnlock-types").IUnpackYarnLockDataRow<T>>>;
