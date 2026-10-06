import { IOptionsDedupe } from './lib/types';
/**
 * 接受 Record 形式的 lockfile 輸入，序列化後委派給根目錄的 listDuplicates。
 *
 * Accepts a Record-shaped lockfile input, serialises it, then delegates to the
 * root listDuplicates.
 *
 * @deprecated 請改用套件根目錄匯出的同名函式 / use the same-named export from the package root instead
 */
export declare function listDuplicates(yarnlock_old: Record<string, any> | Buffer | string, options?: IOptionsDedupe): string[];
/**
 * 接受 Record 形式的 lockfile 輸入，序列化後委派給根目錄的 fixDuplicates。
 *
 * Accepts a Record-shaped lockfile input, serialises it, then delegates to the
 * root fixDuplicates.
 *
 * @deprecated 請改用套件根目錄匯出的同名函式 / use the same-named export from the package root instead
 */
export declare function fixDuplicates(yarnlock_old: Record<string, any> | Buffer | string, options?: IOptionsDedupe): string;
/**
 * 接受 Record 形式的 lockfile 輸入，序列化後委派給根目錄的 yarnDedupe。
 *
 * Accepts a Record-shaped lockfile input, serialises it, then delegates to the
 * root yarnDedupe.
 *
 * @deprecated 請改用套件根目錄匯出的同名函式 / use the same-named export from the package root instead
 */
export declare function yarnDedupe(yarnlock_old: string, options?: IOptionsDedupe): {
    yarnlock_old: string;
    yarnlock_new: string;
    yarnlock_changed: boolean;
};
/**
 * 彙整上述已棄用函式，維持與根目錄預設匯出相同的表面。
 *
 * Groups the deprecated functions above, keeping the same surface as the root
 * default export.
 *
 * @deprecated 請改用套件根目錄的預設匯出 / use the default export from the package root instead
 */
declare const auto: {
    readonly listDuplicates: typeof listDuplicates;
    readonly fixDuplicates: typeof fixDuplicates;
    readonly yarnDedupe: typeof yarnDedupe;
};
/**
 * 以已棄用的函式物件作為預設匯出。
 *
 * Default export of the deprecated function object.
 *
 * @deprecated 請改用套件根目錄的預設匯出 / use the default export from the package root instead
 */
export default auto;
