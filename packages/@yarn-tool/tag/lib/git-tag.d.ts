import { IOptionsPackageTag } from './types';
import { ISpawnGitAsyncOptions } from '@git-lazy/spawn';
export declare function gitPackageTag(options: IOptionsPackageTag, spawnOptions?: ISpawnGitAsyncOptions): Promise<import("@git-lazy/spawn").SpawnASyncReturns<string | Buffer<ArrayBufferLike>>>;
export default gitPackageTag;
