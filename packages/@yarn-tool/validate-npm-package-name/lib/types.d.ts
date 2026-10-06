/**
 * npm 套件名稱驗證的共用型別與正規表示式
 * Shared types and regexp for npm package name validation
 *
 * @module @yarn-tool/validate-npm-package-name/lib/types
 */
/**
 * 命中 scoped 套件（@scope/name）的正規表示式
 * Regexp that matches scoped package names (@scope/name)
 *
 * scope 與 name 都刻意允許任意非斜線字元，
 * 因為是否合法交由驗證規則決定，此處只負責切分。
 * Both scope and name deliberately allow any non-slash characters,
 * because validity is decided by the rules; this pattern only splits the parts.
 */
export declare const scopedPackagePattern: RegExp;
/**
 * 基本驗證結果
 * Basic validation result
 */
export interface IResult {
    /** 是否可作為新套件名稱發布 / Whether it may be published as a new package name */
    validForNewPackages: boolean;
    /** 是否符合舊版 npm 仍接受的名稱規則 / Whether it matches the legacy rules old npm still accepted */
    validForOldPackages: boolean;
    /** 警告訊息：舊名稱仍可用但已被淘汰 / Warning messages: still allowed legacy names that are now discouraged */
    warnings?: string[];
    /** 錯誤訊息：完全不符合規則 / Error messages: not conforming to the rules at all */
    errors?: string[];
}
/**
 * 驗證選項
 * Validation options
 */
export interface IOptions {
    /** 用於核心模組名稱判斷的目標 Node.js 版本 / Target Node.js version used for core module name detection */
    targetNodeJSVersion?: string;
    /** 自訂黑名單，可為字串或正規表示式 / Custom blacklist, either literal strings or regular expressions */
    blacklist?: (string | RegExp)[];
    /** 發生錯誤時是否拋出 RangeError / Whether to throw a RangeError when errors occur */
    throwErr?: boolean;
}
/**
 * 擴充驗證結果：附帶原始名稱與 scope 切分資訊
 * Extended validation result: carries the original name and its scope breakdown
 */
export interface IValidateNpmPackageNameReturnType extends IResult {
    /** 是否符合 scoped 套件格式（@scope/name）/ Whether it matches the scoped package format (@scope/name) */
    scopedPackagePattern: boolean;
    /** 原始輸入名稱 / The original input name */
    name: string;
    /** scope 部分（僅 scoped 套件）/ The scope part (scoped packages only) */
    user?: string;
    /** scope 後的子名稱（僅 scoped 套件）/ The sub name after the scope (scoped packages only) */
    subname?: string;
}
