import { ITSValueOrArrayMaybeReadonly } from "ts-type";
import { IExcludeReadonlyArray, IIgnoreFileOptions } from "./types";
export declare function _normalize(line: string): string;
export declare function _normalizeLines(lines: string[]): string[];
export declare function _normalizeValueOrArray<T extends ITSValueOrArrayMaybeReadonly<string>>(patterns: T, overwrite?: boolean): IExcludeReadonlyArray<T>;
export declare function _stringifyEndOfLine(count?: IIgnoreFileOptions['endCount'], defaultCount?: number): string;
