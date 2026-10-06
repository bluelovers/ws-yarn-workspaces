import { IListableRow } from './types';
import { Options } from 'micromatch';
/**
 * 以 glob（萬用字元）模式過濾套件列清單，僅比對套件名稱。
 * Filter a list of package rows by a glob pattern, matching only the package name.
 *
 * @param list 待過濾的列清單。The list of rows to filter.
 * @param globPattern glob 模式，可為單一字串或多個模式。A glob pattern, either a single string or multiple patterns.
 * @param globOptions 傳給 micromatch 的比對選項。Comparison options forwarded to micromatch.
 * @returns 符合模式的列清單，型別與輸入一致。The matching rows, preserving the input type.
 */
export declare function globFilterListable<T extends IListableRow>(list: T[], globPattern: string | string[], globOptions?: Options): T[];
