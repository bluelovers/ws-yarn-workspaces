import { ITSArrayListMaybeReadonly, ITSValueOrArrayMaybeReadonly } from 'ts-type';
export declare function _readonlyArrayToMutable<T>(array: ITSArrayListMaybeReadonly<T> | Iterable<T>): T[];
export declare function _handleValueOrArrayCore<T extends ITSArrayListMaybeReadonly<string>>(patterns: T | string | Iterable<string>): T;
export declare function _handleValueOrArrayToMutable(patterns: ITSValueOrArrayMaybeReadonly<string> | Iterable<string>): string[];
