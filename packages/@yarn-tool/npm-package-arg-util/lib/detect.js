"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAliasResult = isAliasResult;
exports.isFileResult = isFileResult;
exports.isRegistryResult = isRegistryResult;
exports.isHostedGitResult = isHostedGitResult;
exports.isURLResult = isURLResult;
exports.isNpmPackageArgResult = isNpmPackageArgResult;
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
function isAliasResult(npaResult) {
    return npaResult.type === 'alias';
}
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
function isFileResult(npaResult) {
    return npaResult.type === 'file' || npaResult.type === 'directory';
}
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
function isRegistryResult(npaResult) {
    return npaResult.type === 'version' || npaResult.type === 'range' || npaResult.type === 'tag';
}
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
function isHostedGitResult(npaResult) {
    var _a, _b;
    return npaResult.type === 'git' && ((_b = (_a = npaResult.hosted) === null || _a === void 0 ? void 0 : _a.domain) === null || _b === void 0 ? void 0 : _b.length) > 0;
}
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
function isURLResult(npaResult) {
    return npaResult.type === 'git' && !isHostedGitResult(npaResult) || npaResult.type === 'remote';
}
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
function isNpmPackageArgResult(npaResult) {
    return isAliasResult(npaResult) || isFileResult(npaResult) || isRegistryResult(npaResult) || isHostedGitResult(npaResult) || isURLResult(npaResult);
}
//# sourceMappingURL=detect.js.map