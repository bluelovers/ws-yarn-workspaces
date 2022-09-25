import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';
export declare function _fillDummyScriptsCore<T extends Record<string, string>>(scripts: T, prefix: string, fields: ITSArrayListMaybeReadonly<string>): T;
export declare function fillDummyScripts<T extends Record<string, string>>(scripts?: T, prefix?: string): T;
