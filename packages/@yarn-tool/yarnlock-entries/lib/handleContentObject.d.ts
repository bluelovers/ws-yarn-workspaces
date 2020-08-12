import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-parse/index';
import YarnLockIterator from './YarnLockIterator';
export declare function handleContentObject<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(data: T): YarnLockIterator<T, import("@yarn-tool/yarnlock-parse").IUnpackYarnLockDataRow<T>>;
