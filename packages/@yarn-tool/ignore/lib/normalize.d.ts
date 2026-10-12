import { ITSValueOrArrayMaybeReadonly } from "ts-type";
import { IExcludeReadonlyArray, IIgnoreFileOptions } from "./types";
export declare function _normalize(line: string): string;
export declare function _normalizeLines(lines: string[]): string[];
export declare function _normalizeValueOrArray<T extends ITSValueOrArrayMaybeReadonly<string>>(patterns: T, overwrite?: boolean): IExcludeReadonlyArray<T>;
/**
 * 依計數還原行尾換行字串
 * Restore end-of-line newlines from a count
 *
 * @param count - 要還原的換行數量 / How many newlines to restore
 * @param defaultCount - `count` 不可用時採用的預設值 / Default used when `count` is unusable
 * @param clamp - 內部參數，轉交 `_normalizeEndCount`：`true` 時超出範圍的數字
 *   不改採預設值，而由 `_normalizeEndCount` 收斂到範圍內
 * Internal parameter forwarded to `_normalizeEndCount`: when `true` an
 *   out-of-range number does not take the default and is converged into the
 *   range by `_normalizeEndCount` instead
 */
export declare function _stringifyEndOfLine(count?: IIgnoreFileOptions['endCount'], defaultCount?: IIgnoreFileOptions['endCount'], clamp?: boolean): string;
