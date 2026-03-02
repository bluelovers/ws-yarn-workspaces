/**
 * @fileoverview Type guard functions for npm-package-arg results
 * @description npm-package-arg 結果的類型守衛函數
 *
 * This module provides type guard functions to determine the specific
 * type of an npm-package-arg result at runtime while providing type
 * narrowing in TypeScript.
 *
 * 本模組提供類型守衛函數，用於在執行時確定 npm-package-arg 結果的具體類型，
 * 同時在 TypeScript 中提供類型縮小。
 */
import { AliasResult, FileResult, HostedGitResult, RegistryResult, URLResult } from 'npm-package-arg';
import { IResult, IResultAll } from './types';
/**
 * Check if the result is an AliasResult
 * 檢查結果是否為 AliasResult
 *
 * An alias result represents a package alias (e.g., "my-pkg@npm:other-pkg@version").
 * The type will be 'alias' and the result will contain a subSpec property.
 *
 * 別名結果代表套件別名（例如："my-pkg@npm:other-pkg@version"）。
 * 類型將是 'alias'，結果將包含 subSpec 屬性。
 *
 * @param {IResult} npaResult - The npm-package-arg result to check
 * @param {IResult} npaResult - 要檢查的 npm-package-arg 結果
 *
 * @returns {boolean} True if the result is an AliasResult
 * @returns {boolean} 如果結果是 AliasResult 則返回 true
 *
 * @example
 * const result = npa('my-lodash@npm:lodash@4.17.21');
 * isAliasResult(result); // true
 */
export declare function isAliasResult(npaResult: IResult): npaResult is AliasResult;
/**
 * Check if the result is a FileResult
 * 檢查結果是否為 FileResult
 *
 * A file result represents a local file or directory package
 * (e.g., "./packages/my-pkg", "../other-pkg", "file:./tarball.tgz").
 * The type will be 'file' or 'directory'.
 *
 * 檔案結果代表本地檔案或目錄套件
 * （例如："./packages/my-pkg"、"../other-pkg"、"file:./tarball.tgz"）。
 * 類型將是 'file' 或 'directory'。
 *
 * @param {IResult} npaResult - The npm-package-arg result to check
 * @param {IResult} npaResult - 要檢查的 npm-package-arg 結果
 *
 * @returns {boolean} True if the result is a FileResult
 * @returns {boolean} 如果結果是 FileResult 則返回 true
 *
 * @example
 * const result = npa('./my-local-package');
 * isFileResult(result); // true
 */
export declare function isFileResult(npaResult: IResult): npaResult is FileResult;
/**
 * Check if the result is a RegistryResult
 * 檢查結果是否為 RegistryResult
 *
 * A registry result represents a package from npm registry with:
 * - 'version': exact version (e.g., "lodash@4.17.21")
 * - 'range': version range (e.g., "lodash@^4.0.0")
 * - 'tag': dist-tag (e.g., "lodash@latest", "lodash@beta")
 *
 * registry 結果代表來自 npm registry 的套件：
 * - 'version': 精確版本（例如："lodash@4.17.21"）
 * - 'range': 版本範圍（例如："lodash@^4.0.0"）
 * - 'tag': dist-tag（例如："lodash@latest"、"lodash@beta"）
 *
 * @param {IResult} npaResult - The npm-package-arg result to check
 * @param {IResult} npaResult - 要檢查的 npm-package-arg 結果
 *
 * @returns {boolean} True if the result is a RegistryResult
 * @returns {boolean} 如果結果是 RegistryResult 則返回 true
 *
 * @example
 * const result = npa('lodash@^4.17.0');
 * isRegistryResult(result); // true
 */
export declare function isRegistryResult(npaResult: IResult): npaResult is RegistryResult;
/**
 * Check if the result is a HostedGitResult
 * 檢查結果是否為 HostedGitResult
 *
 * A hosted git result represents a package from a hosted git service
 * (e.g., GitHub, GitLab, Bitbucket) with a recognizable domain.
 * Examples: "user/repo", "github:user/repo", "gitlab:user/repo"
 *
 * 託管 git 結果代表來自託管 git 服務的套件
 * （例如 GitHub、GitLab、Bitbucket），具有可識別的網域。
 * 例如："user/repo"、"github:user/repo"、"gitlab:user/repo"
 *
 * @param {IResult} npaResult - The npm-package-arg result to check
 * @param {IResult} npaResult - 要檢查的 npm-package-arg 結果
 *
 * @returns {boolean} True if the result is a HostedGitResult
 * @returns {boolean} 如果結果是 HostedGitResult 則返回 true
 *
 * @example
 * const result = npa('bluelovers/ws-yarn-workspaces');
 * isHostedGitResult(result); // true
 */
export declare function isHostedGitResult(npaResult: IResultAll): npaResult is HostedGitResult;
/**
 * Check if the result is a URLResult
 * 檢查結果是否為 URLResult
 *
 * A URL result represents a git URL or remote tarball that is not
 * from a recognized hosted git service.
 * Examples: "git+https://example.com/repo.git", "https://example.com/tarball.tgz"
 *
 * URL 結果代表不是來自可識別的託管 git 服務的 git URL 或遠端 tarball。
 * 例如："git+https://example.com/repo.git"、"https://example.com/tarball.tgz"
 *
 * @param {IResult} npaResult - The npm-package-arg result to check
 * @param {IResult} npaResult - 要檢查的 npm-package-arg 結果
 *
 * @returns {boolean} True if the result is a URLResult
 * @returns {boolean} 如果結果是 URLResult 則返回 true
 *
 * @example
 * const result = npa('git+https://github.com/user/repo.git');
 * isURLResult(result); // true (if not recognized as hosted)
 */
export declare function isURLResult(npaResult: IResult): npaResult is URLResult;
/**
 * Check if the result is any valid npm package argument result
 * 檢查結果是否為任何有效的 npm 套件參數結果
 *
 * This function checks if the result matches any of the known
 * npm-package-arg result types.
 *
 * 此函數檢查結果是否匹配任何已知的 npm-package-arg 結果類型。
 *
 * @template T - The specific result type to check for
 * @template T - 要檢查的特定結果類型
 *
 * @param {IResult} npaResult - The npm-package-arg result to check
 * @param {IResult} npaResult - 要檢查的 npm-package-arg 結果
 *
 * @returns {boolean} True if the result is a valid npm package argument result
 * @returns {boolean} 如果結果是有效的 npm 套件參數結果則返回 true
 *
 * @example
 * const result = npa('lodash@^4.17.0');
 * isNpmPackageArgResult(result); // true
 */
export declare function isNpmPackageArgResult<T extends IResult>(npaResult: IResult): npaResult is T;
/**
 * Check if the raw input is the same as the package name
 * 檢查原始輸入是否與套件名稱相同
 *
 * This function compares the trimmed raw input with the package name
 * to determine if the user provided only the package name without
 * any version specification.
 *
 * 此函數比較去除空白後的原始輸入與套件名稱，
 * 判斷使用者是否只提供了套件名稱而沒有任何版本規格。
 *
 * @template T - The type of result, extends IResult
 * @template T - 結果類型，繼承自 IResult
 *
 * @param {IResult} result - The npm-package-arg result to check
 * @param {IResult} result - 要檢查的 npm-package-arg 結果
 *
 * @returns {boolean} True if raw input equals the package name
 * @returns {boolean} 如果原始輸入等於套件名稱則返回 true
 *
 * @example
 * // Input: "lodash"
 * // 輸入："lodash"
 * isNameSameAsRaw(result); // true
 *
 * @example
 * // Input: "lodash@"
 * // 輸入："lodash@"
 * isNameSameAsRaw(result); // true (name + @)
 *
 * @example
 * // Input: "lodash@^4.0.0"
 * // 輸入："lodash@^4.0.0"
 * isNameSameAsRaw(result); // false
 */
export declare function isNameSameAsRaw<T extends IResult>(result: IResult): boolean;
/**
 * Check if the rawSpec property is empty
 * 檢查 rawSpec 屬性是否為空
 *
 * This function checks if the rawSpec (the version part after @)
 * is empty or contains only whitespace. This is useful for detecting
 * cases like "package@" where no version is specified.
 *
 * 此函數檢查 rawSpec（@ 後面的版本部分）是否為空或只包含空白字元。
 * 用於檢測像 "package@" 這樣沒有指定版本的情況。
 *
 * @param {IResult} result - The npm-package-arg result to check
 * @param {IResult} result - 要檢查的 npm-package-arg 結果
 *
 * @returns {boolean} True if rawSpec is empty or whitespace only
 * @returns {boolean} 如果 rawSpec 為空或只有空白則返回 true
 *
 * @example
 * // Input: "lodash@" or "lodash@ "
 * // 輸入："lodash@" 或 "lodash@ "
 * isRawSpecIsEmpty(result); // true
 *
 * @example
 * // Input: "lodash@4.17.21"
 * // 輸入："lodash@4.17.21"
 * isRawSpecIsEmpty(result); // false
 */
export declare function isRawSpecIsEmpty(result: IResult): boolean;
/**
 * Check if the input specification is a star wildcard
 * 檢查輸入規格是否為星號萬用字元
 *
 * This function detects if the user input is a star (*) wildcard
 * which represents "any version". It handles both bare "*" and
 * "package@*" formats.
 *
 * 此函數檢測使用者輸入是否為星號 (*) 萬用字元，
 * 代表「任何版本」。處理純 "*" 和 "package@*" 格式。
 *
 * @param {IResult} result - The npm-package-arg result to check
 * @param {IResult} result - 要檢查的 npm-package-arg 結果
 *
 * @returns {boolean} True if the input is a star wildcard
 * @returns {boolean} 如果輸入是星號萬用字元則返回 true
 *
 * @example
 * // Input: "*"
 * // 輸入："*"
 * isInputSpecIsStar(result); // true
 *
 * @example
 * // Input: "lodash@*"
 * // 輸入："lodash@*"
 * isInputSpecIsStar(result); // true
 *
 * @example
 * // Input: "lodash@4.17.21"
 * // 輸入："lodash@4.17.21"
 * isInputSpecIsStar(result); // false
 */
export declare function isInputSpecIsStar(result: IResult): boolean;
/**
 * Check if the input specification is effectively empty
 * 檢查輸入規格是否實際上為空
 *
 * This function performs a comprehensive check to determine if
 * the user provided an empty or default version specification.
 * It returns true when:
 * - rawSpec is empty (e.g., "package@")
 * - The input is just the package name (no version specified)
 * - fetchSpec defaults to '*' (any version)
 *
 * 此函數執行全面檢查以判斷使用者是否提供了空或預設的版本規格。
 * 在以下情況返回 true：
 * - rawSpec 為空（例如："package@"）
 * - 輸入只有套件名稱（未指定版本）
 * - fetchSpec 預設為 '*'（任何版本）
 *
 * @param {IResult} result - The npm-package-arg result to check
 * @param {IResult} result - 要檢查的 npm-package-arg 結果
 *
 * @returns {boolean} True if the input spec is considered empty
 * @returns {boolean} 如果輸入規格被視為空則返回 true
 *
 * @example
 * // Input: "" (empty string)
 * // 輸入：""（空字串）
 * isInputSpecIsEmpty(result); // true
 *
 * @example
 * // Input: " " (space)
 * // 輸入：" "（空格）
 * isInputSpecIsEmpty(result); // true
 *
 * @example
 * // Input: "lodash" (no version)
 * // 輸入："lodash"（無版本）
 * isInputSpecIsEmpty(result); // true
 *
 * @example
 * // Input: "lodash@4.17.21"
 * // 輸入："lodash@4.17.21"
 * isInputSpecIsEmpty(result); // false
 */
export declare function isInputSpecIsEmpty(result: IResult): boolean;
