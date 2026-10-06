"use strict";
/**
 * @fileoverview Utility function to extract semver from npm-package-arg results
 * @description 從 npm-package-arg 結果提取 semver 的工具函數
 *
 * This module provides a function to extract the semantic version
 * or version range from various types of npm-package-arg results.
 *
 * 本模組提供從各種類型的 npm-package-arg 結果中
 * 提取語意版本或版本範圍的函數。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSemverFromNpaResult = getSemverFromNpaResult;
/**
 * Extract the semantic version from an npm-package-arg result
 * 從 npm-package-arg 結果提取語意版本
 *
 * This function extracts the version specifier from different types
 * of npm-package-arg results. For alias results, it extracts the
 * version from the sub-spec; for other types, it uses the rawSpec.
 *
 * 此函數從不同類型的 npm-package-arg 結果中提取版本指定符。
 * 對於別名結果，它從子規格中提取版本；
 * 對於其他類型，它使用 rawSpec。
 *
 * @param {IResult} npaResult - The npm-package-arg result to extract from
 * @param {IResult} npaResult - 要從中提取的 npm-package-arg 結果
 *
 * @returns {string} The extracted semantic version or range
 * @returns {string} 提取的語意版本或範圍
 *
 * @example
 * // Extract version from a versioned package
 * // 從帶版本的套件提取版本
 * const result = npa('lodash@4.17.21');
 * getSemverFromNpaResult(result); // '4.17.21'
 *
 * @example
 * // Extract version range from a ranged package
 * // 從帶版本範圍的套件提取範圍
 * const result = npa('lodash@^4.0.0');
 * getSemverFromNpaResult(result); // '^4.0.0'
 *
 * @example
 * // Extract version from an alias
 * // 從別名提取版本
 * const result = npa('my-lodash@npm:lodash@4.17.21');
 * getSemverFromNpaResult(result); // '4.17.21'
 */
function getSemverFromNpaResult(npaResult) {
    let semver;
    /**
     * 依 result.type 決定版本來源：別名的版本藏在子規格，其餘型別直接取 rawSpec
     * Decide the version source by `result.type`: an alias keeps its version in the sub-spec,
     * every other type exposes it directly as `rawSpec`
     */
    switch (npaResult.type) {
        case 'alias':
            /**
             * 別名（my-pkg@npm:other-pkg@version）的版本寫在 subSpec 而非外層 rawSpec
             * For an alias (my-pkg@npm:other-pkg@version) the version lives in `subSpec`, not in the outer `rawSpec`
             */
            semver = npaResult.subSpec.rawSpec;
            break;
        default:
            /**
             * 其他型別直接使用 rawSpec；例如只有名稱的輸入經 npa 正規化後 rawSpec 為 "*"
             * Other types use `rawSpec` as-is; a name-only input, for example, is normalized by
             * npa into a `rawSpec` of `"*"`
             */
            semver = npaResult.rawSpec;
            break;
    }
    return semver;
}
/**
 * 預設匯出 getSemverFromNpaResult，讓 `import getSemver from '...'` 可直接使用
 * Default-export getSemverFromNpaResult so `import getSemver from '...'` works directly
 */
exports.default = getSemverFromNpaResult;
//# sourceMappingURL=getSemverFromNpaResult.js.map