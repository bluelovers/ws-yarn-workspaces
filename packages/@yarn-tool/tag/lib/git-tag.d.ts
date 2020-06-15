/// <reference types="node" />
import { IOptionsPackageTagInput } from './types';
import { ISpawnGitAsyncOptions } from '@git-lazy/spawn';
export declare function gitPackageTag(options: IOptionsPackageTagInput, spawnOptions?: ISpawnGitAsyncOptions): Promise<import("cross-spawn-extra/core").SpawnASyncReturns<string | Buffer>>;
export default gitPackageTag;
