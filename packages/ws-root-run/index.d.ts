/// <reference types="node" />
import crossSpawn, { SpawnSyncOptions, SpawnOptions } from 'cross-spawn-extra';
export type INpmClient = string | 'npm' | 'yarn' | 'lerna';
export declare function spawnWsRootRun(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnOptions;
}): crossSpawn.SpawnASyncReturnsPromise<Buffer>;
export declare function spawnWsRootExec(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnOptions;
}): crossSpawn.SpawnASyncReturnsPromise<Buffer>;
export declare function spawnWsRootRunSync(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnSyncOptions;
}): crossSpawn.SpawnSyncReturns<Buffer>;
export declare function spawnWsRootExecSync(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnSyncOptions;
}): crossSpawn.SpawnSyncReturns<Buffer>;
export default spawnWsRootRun;
