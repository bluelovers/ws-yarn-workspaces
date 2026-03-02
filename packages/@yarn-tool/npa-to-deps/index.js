"use strict";
/**
 * @fileoverview Convert npm-package-arg results to dependency values
 * @description 將 npm-package-arg 結果轉換為依賴值
 *
 * This module provides utilities to convert npm-package-arg (npa) parsing results
 * into standardized dependency value objects. It handles various input types
 * including git URLs, version tags, semver ranges, and local file paths.
 *
 * 本模組提供將 npm-package-arg (npa) 解析結果轉換為標準化依賴值物件的工具。
 * 處理各種輸入類型，包括 git URL、版本標籤、semver 範圍和本地檔案路徑。
 *
 * @module @yarn-tool/npa-to-deps
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.npaResultToDepsValue = npaResultToDepsValue;
exports.npaToDepsValue = npaToDepsValue;
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const parseSimpleSemVerRange_1 = require("@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange");
const detect_1 = require("@yarn-tool/npm-package-arg-util/lib/detect");
/**
 * Convert an npm-package-arg result to a dependency value object
 * 將 npm-package-arg 結果轉換為依賴值物件
 *
 * This function takes a parsed npm-package-arg result and converts it into
 * a standardized dependency value format suitable for package.json dependencies.
 * It handles various result types including git, tags, ranges, versions, etc.
 *
 * 此函數接受解析後的 npm-package-arg 結果，並將其轉換為適合 package.json
 * 依賴項的標準化依賴值格式。處理各種結果類型，包括 git、標籤、範圍、版本等。
 *
 * @template T - The type of npm-package-arg result / npm-package-arg 結果的類型
 *
 * @param {T} result - The npm-package-arg parsing result / npm-package-arg 解析結果
 *
 * @param {IOptions} [options] - Conversion options / 轉換選項
 *
 * @returns {IDepsResult<T>} Standardized dependency value object / 標準化的依賴值物件
 *
 * @example
 * // Git repository
 * // Git 儲存庫
 * const result = npa('github:user/repo#branch');
 * npaResultToDepsValue(result);
 * // => { name: 'repo', semver: 'github:user/repo#branch', result: ... }
 *
 * @example
 * // Version tag with preserveTag
 * // 保留標籤的版本標籤
 * const result = npa('lodash@latest');
 * npaResultToDepsValue(result, { preserveTag: true });
 * // => { name: 'lodash', semver: 'latest', operator: undefined, ... }
 *
 * @example
 * // Version tag without preserveTag (default behavior)
 * // 不保留標籤的版本標籤（預設行為）
 * const result = npa('lodash@latest');
 * npaResultToDepsValue(result);
 * // => { name: 'lodash', operator: '^', fetchQuery: true, ... }
 *
 * @example
 * // Semver range with ^ operator
 * // 帶有 ^ 運算子的 semver 範圍
 * const result = npa('lodash@^4.17.0');
 * npaResultToDepsValue(result);
 * // => { name: 'lodash', operator: '^', fetchQuery: true, ... }
 *
 * @example
 * // Exact version
 * // 精確版本
 * const result = npa('lodash@4.17.21');
 * npaResultToDepsValue(result);
 * // => { name: 'lodash', semver: '4.17.21', ... }
 */
function npaResultToDepsValue(result, options) {
    var _a, _b, _c;
    let semver;
    let operator;
    let fetchQuery;
    switch (result.type) {
        /**
         * Git type: use saveSpec as the semver value
         * Git 類型：使用 saveSpec 作為 semver 值
         */
        case 'git':
            semver = result.saveSpec;
            break;
        /**
         * Tag type: handle based on preserveTag option
         * 標籤類型：根據 preserveTag 選項處理
         */
        case 'tag':
            if (((_a = result.fetchSpec) === null || _a === void 0 ? void 0 : _a.length) && (options === null || options === void 0 ? void 0 : options.preserveTag)) {
                semver = result.fetchSpec;
            }
            else {
                operator = '^';
                fetchQuery = true;
            }
            break;
        /**
         * Range type: complex handling based on range structure
         * 範圍類型：根據範圍結構進行複雜處理
         */
        case 'range':
            // Empty input spec: mark for query
            // 空輸入規格：標記為需要查詢
            if ((0, detect_1.isInputSpecIsEmpty)(result)) {
                semver = void 0;
                fetchQuery = true;
            }
            else if ((_b = result.fetchSpec) === null || _b === void 0 ? void 0 : _b.length) {
                let ls = (0, parseSimpleSemVerRange_1.parseSimpleSemVerRange)(result.fetchSpec);
                // Multiple range entries: keep original
                // 多個範圍項目：保留原始值
                if (ls.length > 1) {
                    semver = result.fetchSpec;
                }
                // Preserve range option is set: keep original
                // 保留範圍選項已設定：保留原始值
                else if (options === null || options === void 0 ? void 0 : options.preserveRange) {
                    semver = result.fetchSpec;
                }
                // Single entry: analyze operator
                // 單一項目：分析運算子
                else if (ls.length === 1) {
                    let entry = ls[0];
                    // No operator: treat as version to query
                    // 無運算子：視為需要查詢的版本
                    if (!entry.operator) {
                        semver = result.fetchSpec;
                        fetchQuery = true;
                    }
                    // Non-^ operator: keep original spec
                    // 非 ^ 運算子：保留原始規格
                    else if (entry.operator !== '^') {
                        semver = result.fetchSpec;
                    }
                    // ^ operator: use shorthand form
                    // ^ 運算子：使用簡短形式
                    else {
                        operator = '^';
                        fetchQuery = true;
                    }
                }
                // No valid entries: use shorthand
                // 無有效項目：使用簡短形式
                else {
                    operator = '^';
                    fetchQuery = true;
                }
            }
            else {
                operator = '^';
                fetchQuery = true;
            }
            break;
        /**
         * Default case: use fetchSpec if available
         * 預設情況：如有 fetchSpec 則使用
         */
        default:
            if ((_c = result.fetchSpec) === null || _c === void 0 ? void 0 : _c.length) {
                semver = result.fetchSpec;
            }
            break;
    }
    return {
        name: result.name,
        semver,
        operator,
        fetchQuery,
        result,
    };
}
/**
 * Parse a package argument string and convert to dependency value
 * 解析套件參數字串並轉換為依賴值
 *
 * This is a convenience function that combines npa parsing with
 * npaResultToDepsValue conversion in one step.
 *
 * 這是一個便利函數，將 npa 解析與 npaResultToDepsValue 轉換合併為一步。
 *
 * @template T - The expected result type / 預期的結果類型
 *
 * @param {string} arg - The package argument string to parse / 要解析的套件參數字串
 *
 * @param {IOptions} [options] - Parsing and conversion options / 解析和轉換選項
 *
 * @returns {IDepsResult<T>} Standardized dependency value object / 標準化的依賴值物件
 *
 * @example
 * // Parse and convert in one step
 * // 一步完成解析和轉換
 * npaToDepsValue('lodash@^4.17.0');
 * // => { name: 'lodash', operator: '^', fetchQuery: true, ... }
 *
 * @example
 * // With options
 * // 使用選項
 * npaToDepsValue('lodash@latest', { preserveTag: true });
 * // => { name: 'lodash', semver: 'latest', ... }
 */
function npaToDepsValue(arg, options) {
    let result = (0, npm_package_arg_util_1.npa)(arg, options === null || options === void 0 ? void 0 : options.where);
    return npaResultToDepsValue(result);
}
exports.default = npaToDepsValue;
//# sourceMappingURL=index.js.map