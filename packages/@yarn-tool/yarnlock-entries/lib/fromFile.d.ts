import { PathLike } from "fs";
import { IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
export declare function fromFile<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_file: PathLike): import("./YarnLockIterator").YarnLockIterator<T, import("@yarn-tool/yarnlock-types").IUnpackYarnLockDataRow<T>>;
export declare function fromFileAsync<T extends IYarnLockParsedV1 | IYarnLockParsedV2>(yarnlock_file: PathLike): Promise<import("./YarnLockIterator").YarnLockIterator<T, import("@yarn-tool/yarnlock-types").IUnpackYarnLockDataRow<T>>>;
