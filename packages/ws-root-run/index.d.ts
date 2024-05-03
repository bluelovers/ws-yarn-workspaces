import { SpawnSyncOptions, SpawnOptions, SpawnSyncReturns, SpawnASyncReturnsPromise } from 'cross-spawn-extra';
export type INpmClient = string | 'npm' | 'yarn' | 'lerna';
export declare function spawnWsRootRun(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnOptions;
}): SpawnASyncReturnsPromise<Buffer>;
export declare function spawnWsRootExec(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnOptions;
}): SpawnASyncReturnsPromise<Buffer>;
export declare function spawnWsRootRunSync(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnSyncOptions;
}): SpawnSyncReturns<Buffer>;
export declare function spawnWsRootExecSync(argv: string[], opts?: {
    cwd?: string;
    npmClient?: INpmClient;
    spawnOptions?: SpawnSyncOptions;
}): SpawnSyncReturns<Buffer>;
export default spawnWsRootRun;
