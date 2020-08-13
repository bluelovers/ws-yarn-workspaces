/// <reference types="node" />
import { IBufferOrString, IOptionsReadFile } from './types';
export declare function checkAndReadYarnLockFileSafe<T extends IBufferOrString = Buffer>(file: string, options?: IOptionsReadFile | BufferEncoding | null): T;
