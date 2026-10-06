import { parseArgvPkgName } from '@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName';
/** scope 與裸名稱的連接分隔字串，產出的名稱須能作為型別識別字的一部分 */
declare const sep = "__";
/**
 * 匹配「可選 scope + 裸名稱」（不含版本）
 * Matches optional scope + bare name (without version)
 *
 * @note `[^@]+` 刻意排除 `@`，讓 `foo@1.2.3` 這類帶版本的字串無法通過驗證
 *       `[^@]+` deliberately excludes `@` so versioned strings like `foo@1.2.3` fail validation
 */
declare const reNamespacedName: RegExp;
/** 在 `reNamespacedName` 基礎上允許可選的 `@version` 後綴 / allows an optional trailing `@version` */
declare const reNamespacedNameWithVersion: RegExp;
/**
 * 公開內部使用的分隔字串與正規表示式 (Regular Expression)，
 * 讓呼叫端能以相同規則自行驗證或組出等價名稱，而不必複製一份易漂移的規則
 * Expose the internal separator and regexes so callers can validate or compose
 * equivalent names with the exact same rules instead of copying ones that may drift
 */
export { sep, reNamespacedName, reNamespacedNameWithVersion };
/**
 * 轉發套件名稱解析器，讓使用者不必直接依賴 `@yarn-tool/npm-package-arg-util`
 * Re-export the package name parser so consumers need not depend on
 * `@yarn-tool/npm-package-arg-util` directly
 */
export { parseArgvPkgName };
/**
 * 判斷字串是否為「可選 scope + 裸名稱」的 namespaced 名稱
 * Check whether a string is a namespaced name (optional scope + bare name)
 *
 * @param packageName - 待驗證的套件名稱 / the package name to test
 * @returns 不含版本號時回傳 true / true when it carries no version
 *
 * @note 使用 `reNamespacedName` 而非 `reNamespacedNameWithVersion`，
 *       因此帶版本號的字串會被判定為 false（契約：namespaced name 不含版本）
 *       Uses `reNamespacedName` rather than `reNamespacedNameWithVersion`, so
 *       versioned strings return false (contract: a namespaced name has no version)
 */
export declare function isNamespacedName(packageName: string): boolean;
/**
 * 轉義套件名稱，使其可安全用作型別名稱
 * Escape a package name so it can be used safely as a type name
 *
 * @param packageName - 原始套件名稱 / the original package name
 * @returns 去除 `@` 並以 `__` 取代 `/`（或 `\`）後的字串
 *          the string with `@` removed and `/` (or `\`) replaced by `__`
 *
 * @note 只取代第一個分隔符：scope 恰好只有一層，其後的 `/` 屬於套件名稱本身
 *       Only the first separator is replaced: a scope is a single segment,
 *       any later `/` belongs to the package name itself
 */
export declare function escapePackageName(packageName: string): string;
/**
 * 萃取套件名稱中的裸名稱（不含 scope 與版本）
 * Extract the bare package name (without scope or version)
 *
 * @param packageName - 套件名稱規格，如 `@scope/name@1.0.0`
 *                      a package spec such as `@scope/name@1.0.0`
 * @returns 裸名稱 / the bare name
 */
export declare function extractName(packageName: string): string;
/**
 * 將套件名稱轉為對應的 `@types` 套件名稱
 * Convert a package name into its matching `@types` package name
 *
 * @param packageName - 套件名稱（可含 scope 與版本）/ package name (may include scope and version)
 * @param includeVersion - 是否把版本號接到名稱後方（預設不接）
 *                         whether to append the version to the name (off by default)
 * @returns 形如 `@types/name` 的型別套件名稱 / a type package name like `@types/name`
 *
 * @note `@types` 下的套件以 `scope__name` 表示 scope，
 *       因此必須先用 `escapePackageName` 轉義再以 `sep` 連接，
 *       方符合 DefinitelyTyped 的目錄命名慣例
 *       Under `@types`, scopes are expressed as `scope__name`, so the scope must
 *       be escaped via `escapePackageName` and joined with `sep` to follow the
 *       DefinitelyTyped directory naming convention
 */
export declare function pkgNameToTypes(packageName: string, includeVersion?: boolean): string;
/**
 * 預設匯出 (Default Export) 指向 `pkgNameToTypes`，
 * 讓「套件名稱轉 @types 名稱」這一主要操作只需預設匯入即可取得
 * The default export points to `pkgNameToTypes` so the primary operation,
 * converting a package name to its `@types` name, is available via a default import
 */
export default pkgNameToTypes;
