/// <reference types="node" />
/// <reference types="node" />
import { ObjectEncodingOptions } from "fs";
export type IBufferOrString = Buffer | string;
export interface IOptionsReadFile extends ObjectEncodingOptions {
    flag?: string;
}
export interface IFsYarnLockReturnType {
    yarnlock_file: string;
    yarnlock_exists: boolean;
    yarnlock_old: string;
}
