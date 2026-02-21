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
    // Handle different result types
    // 處理不同的結果類型
    switch (npaResult.type) {
        case 'alias':
            // For alias results, extract version from the sub-spec
            // 對於別名結果，從子規格提取版本
            semver = npaResult.subSpec.rawSpec;
            break;
        default:
            // For other types, use the rawSpec directly
            // 對於其他類型，直接使用 rawSpec
            semver = npaResult.rawSpec;
            break;
    }
    return semver;
}
// Default export for convenience
// 預設匯出以方便使用
exports.default = getSemverFromNpaResult;
//# sourceMappingURL=getSemverFromNpaResult.js.map