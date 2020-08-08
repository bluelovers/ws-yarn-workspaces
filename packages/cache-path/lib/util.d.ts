/// <reference types="node" />
import { SpawnSyncOptionsWithBufferEncoding } from "child_process";
export declare function findPkgPath(cwd?: string): string;
export declare function spawn_stdout(bin: string, argv?: string[], options?: SpawnSyncOptionsWithBufferEncoding): string;
export declare function ObjectFreezeAll<T>(obj: T): Readonly<T>;
declare const _default: typeof import("./util");
export default _default;
