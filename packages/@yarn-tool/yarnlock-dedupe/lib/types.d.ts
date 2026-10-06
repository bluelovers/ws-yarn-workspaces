/**
 * 去重 (dedupe) 操作的共用選項，v1 與 v2 實作皆由此介面接收。
 *
 * Shared options for dedupe operations, accepted by both the v1 and v2
 * implementations.
 */
export interface IOptionsDedupe {
    /** 只處理指定 scope（命名空間）內的套件 / Only handle packages under the given scopes. */
    includeScopes?: string[];
    /** 只處理指定的套件名稱 / Only handle the listed package names. */
    includePackages?: string[];
    /** 要排除的套件名稱 / Package names to exclude from dedupe. */
    excludePackages?: string[];
    /** 保留較常見的版本而非一律升級，由 yarn-deduplicate (v1) 使用 / Keep the most common version instead of always upgrading; used by yarn-deduplicate (v1). */
    useMostCommon?: boolean;
}
