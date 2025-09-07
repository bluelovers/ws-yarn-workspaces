import { IOptionsPackageTag } from './types';
import { ISpawnGitAsyncOptions } from '@git-lazy/spawn';
export declare function gitPackageTag(options: IOptionsPackageTag, spawnOptions?: ISpawnGitAsyncOptions): Promise<import("cross-spawn-extra").SpawnASyncReturns<string | Buffer<ArrayBufferLike>>>;
export default gitPackageTag;
