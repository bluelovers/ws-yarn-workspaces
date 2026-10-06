/**
 * 套件名稱 (Package Name) 的組成資料
 * Composition data of a package name
 *
 * @note scope 可帶或不帶 `@` 前綴，由 `formatPackageName` 統一補齊，
 *       讓呼叫端不必在意輸入格式
 *       The scope may or may not include the `@` prefix; `formatPackageName`
 *       normalizes it so callers do not need to care about input format
 */
export interface IPackageNameInfo {
    /** 選填的範圍 (Scope)，例如 `@yarn-tool` 或 `yarn-tool` */
    scope?: string;
    /** 必填的裸名稱 (Bare Name)，不含 scope */
    name: string;
}
/**
 * 將 scope 與 name 組合成完整的套件名稱
 * Compose scope and name into a full package name
 *
 * @param data - 套件名稱組成資料 / composition data of the package name
 * @returns 完整套件名稱 / the full package name
 * @throws {TypeError} name 為空時丟出，避免產生空字串的無效名稱
 *                       thrown when name is empty, to avoid producing an invalid empty name
 */
export declare function formatPackageName(data: IPackageNameInfo): string;
/**
 * 剝離套件名稱中的 scope，只保留裸名稱
 * Strip the scope from a package name, keeping only the bare name
 *
 * @param packageName - 完整或不含 scope 的套件名稱 / full or scope-less package name
 * @returns 裸名稱；不含 scope 時回傳原字串
 *          the bare name; returns the input unchanged when it has no scope
 *
 * @note `indexOf` 找不到 `/` 時回傳 -1，加 1 後變成 0，
 *       `slice(0)` 恰好回傳原字串，因此不需額外分支處理無 scope 的情況
 *       When `indexOf` finds no `/` it returns -1; adding 1 yields 0 and
 *       `slice(0)` returns the original string, so no extra branch is needed
 */
export declare function stripScope(packageName: string): string;
/**
 * 斷言 scope 格式合法，不合法時丟出 TypeError
 * Assert that a scope is valid, throwing TypeError otherwise
 *
 * @param scope - 待驗證的範圍 / the scope to validate
 * @param includeAtSign - 若為 boolean，則要求 scope 是否以 `@` 開頭必須與之相符；
 *                        省略時不檢查 `@` 的有無
 *                        when a boolean, the presence of the leading `@` must match it;
 *                        omit to skip the `@` check
 * @throws {TypeError} scope 不符規則時丟出 / thrown when the scope violates the rules
 *
 * @note 驗證規則：去 `@` 後不可為空，且只能包含 `\w`、`-`、`_`
 *       Validation rule: after removing `@` it must be non-empty and contain only `\w`, `-`, `_`
 */
export declare function assertScope(scope: string, includeAtSign?: boolean): asserts scope is string;
/**
 * 驗證 scope 是否合法的非丟出版本
 * Non-throwing variant that validates whether a scope is legal
 *
 * @param scope - 待驗證的範圍 / the scope to validate
 * @param includeAtSign - 同 `assertScope` / same as `assertScope`
 * @returns scope 合法時回傳 true / true when the scope is valid
 *
 * @note 以 try/catch 包裹 `assertScope` 以統一驗證規則，
 *       避免與 `assertScope` 的規則逐漸分歧（DRY）
 *       Wraps `assertScope` in try/catch to keep a single source of
 *       validation rules and prevent them from drifting apart (DRY)
 */
export declare function validScope(scope: string, includeAtSign?: boolean): scope is string;
/**
 * 預設匯出 (Default Export) 指向 `formatPackageName`，
 * 讓最常見的「組合套件名稱」操作只需 `import formatPackageName from ...` 即可取得
 * The default export points to `formatPackageName` so the most common operation,
 * composing a package name, is available via a plain default import
 */
export default formatPackageName;
