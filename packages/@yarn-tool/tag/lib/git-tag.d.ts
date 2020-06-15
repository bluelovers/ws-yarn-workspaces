/// <reference types="node" />
import { IOptionsPackageTag } from './types';
import { ISpawnGitAsyncOptions } from '@git-lazy/spawn';
export declare function gitPackageTag(options: IOptionsPackageTag, spawnOptions?: ISpawnGitAsyncOptions): Promise<import("cross-spawn-extra/core").SpawnASyncReturns<string | Buffer>>;
export default gitPackageTag;
