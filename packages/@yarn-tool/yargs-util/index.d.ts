import { Argv } from 'yargs';
export type IUnpackYargsArgv<T extends Argv, D = any> = T extends Argv<infer U> ? U : D;
export declare function yargsProcessExit(msg: string | Error, code?: number): void;
