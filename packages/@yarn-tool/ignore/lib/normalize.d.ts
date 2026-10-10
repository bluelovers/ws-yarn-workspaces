import { ITSValueOrArrayMaybeReadonly } from "ts-type";
import { IExcludeReadonlyArray } from "./lines";
import { IIgnoreFileOptions } from "./IgnoreFile";
export declare function _normalize(line: string): string;
export declare function _normalizeLines(lines: string[]): string[];
export declare function _normalizeValueOrArray<T extends ITSValueOrArrayMaybeReadonly<string>>(patterns: T, overwrite?: boolean): IExcludeReadonlyArray<T>;
export declare function _omitBlankLines(lines: string[]): {
    lines: string[];
    startCount: number;
    endCount: number;
};
export declare function _stringifyEndOfLine(count?: IIgnoreFileOptions['endCount']): string;
