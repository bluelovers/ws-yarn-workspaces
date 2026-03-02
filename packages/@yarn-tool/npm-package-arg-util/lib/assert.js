"use strict";
/**
 * @fileoverview Assertion functions for npm-package-arg results
 * @description npm-package-arg 結果的斷言函數
 *
 * This module provides assertion functions to validate npm-package-arg
 * parsing results and ensure they meet expected criteria.
 *
 * 本模組提供斷言函數，用於驗證 npm-package-arg 解析結果
 * 並確保它們符合預期條件。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNpaResultHasName = assertNpaResultHasName;
exports.assertNpaResultByType = assertNpaResultByType;
exports.assertNpaResultAll = assertNpaResultAll;
const assert_1 = require("assert");
const detect_1 = require("./detect");
/**
 * Assert that an npm-package-arg result has a valid name property
 * 斷言 npm-package-arg 結果具有有效的名稱屬性
 *
 * This function validates that the parsed package result contains
 * a non-empty name property. It's used to ensure that the parsed
 * argument represents a valid package reference.
 *
 * 此函數驗證解析的套件結果包含非空的名稱屬性。
 * 用於確保解析的參數代表有效的套件引用。
 *
 * @template T - The type of result to validate, extends IResult
 * @template T - 要驗證的結果類型，繼承自 IResult
 *
 * @param {T} result - The npm-package-arg result to validate
 * @param {T} result - 要驗證的 npm-package-arg 結果
 *
 * @throws {Error} Throws if the result has no name or empty name
 * @throws {Error} 如果結果沒有名稱或名稱為空則拋出錯誤
 *
 * @example
 * // Valid package with name
 * // 具有名稱的有效套件
 * const result = npa('lodash@4.17.21');
 * assertNpaResultHasName(result); // Passes silently
 *
 * @example
 * // Invalid package without name
 * // 沒有名稱的無效套件
 * const result = npa('github:user/repo#branch');
 * // This may throw if the result has no name
 * // 如果結果沒有名稱，這可能會拋出錯誤
 */
function assertNpaResultHasName(result) {
    var _a;
    // Check if the result has a valid non-empty name
    // 檢查結果是否具有有效的非空名稱
    if (!((_a = result.name) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new Error(`Invalid input: ${result.raw}. name is required` + (result.type ? ` for ${result.type} type` : ''));
    }
}
/**
 * Assert that an npm-package-arg result has a specific type
 * 斷言 npm-package-arg 結果具有特定類型
 *
 * This function validates that the parsed package result has the
 * expected type, and also performs all standard validations.
 *
 * 此函數驗證解析的套件結果具有預期的類型，
 * 並執行所有標準驗證。
 *
 * @template T - The type of result to validate, extends IResult
 * @template T - 要驗證的結果類型，繼承自 IResult
 *
 * @template TT - The expected type string
 * @template TT - 預期的類型字串
 *
 * @param {T} result - The npm-package-arg result to validate
 * @param {T} result - 要驗證的 npm-package-arg 結果
 *
 * @param {TT} type - The expected type (e.g., 'version', 'range', 'git')
 * @param {TT} type - 預期的類型（例如：'version'、'range'、'git'）
 *
 * @throws {Error} Throws if the result type doesn't match
 * @throws {Error} 如果結果類型不匹配則拋出錯誤
 *
 * @example
 * const result = npa('lodash@4.17.21');
 * assertNpaResultByType(result, 'version');
 */
function assertNpaResultByType(result, type) {
    // Assert the type matches
    // 斷言類型匹配
    (0, assert_1.strictEqual)(result.type, type, `Invalid type: ${result.type}`);
    // Perform all standard validations
    // 執行所有標準驗證
    assertNpaResultAll(result);
}
/**
 * Assert that an npm-package-arg result is valid according to options
 * 斷言 npm-package-arg 結果根據選項是有效的
 *
 * This function performs comprehensive validation on the parsed result,
 * including type validation, name validation, and type-specific checks.
 *
 * 此函數對解析結果執行全面驗證，
 * 包括類型驗證、名稱驗證和特定類型的檢查。
 *
 * @template T - The type of result to validate, extends IResult
 * @template T - 要驗證的結果類型，繼承自 IResult
 *
 * @param {T} result - The npm-package-arg result to validate
 * @param {T} result - 要驗證的 npm-package-arg 結果
 *
 * @param {IOptionsNpaUtil} [options] - Validation options
 * @param {IOptionsNpaUtil} [options] - 驗證選項
 *   - shouldHasName: Whether to require a valid name / 是否需要有效名稱
 *   - allowedType: Array of allowed types / 允許的類型陣列
 *
 * @throws {Error} Throws if validation fails
 * @throws {Error} 如果驗證失敗則拋出錯誤
 *
 * @example
 * // Validate with default options
 * // 使用預設選項驗證
 * const result = npa('lodash@4.17.21');
 * assertNpaResultAll(result);
 *
 * @example
 * // Validate with type restrictions
 * // 使用類型限制驗證
 * const result = npa2('lodash@^4.17.0', {
 *   allowedType: ['version', 'range']
 * });
 * assertNpaResultAll(result, { allowedType: ['version', 'range'] });
 */
function assertNpaResultAll(result, options) {
    let { shouldHasName, allowedType } = options !== null && options !== void 0 ? options : {};
    // Validate allowed types if specified
    // 如果指定了允許的類型則驗證
    (allowedType === null || allowedType === void 0 ? void 0 : allowedType.length) && (0, assert_1.ok)(allowedType.includes(result.type), `Type '${result.type}' not allowed, only allow [${allowedType.join(', ')}]`);
    if (!['range', 'version', 'alias', 'tag'].includes(result.type)) {
        (0, assert_1.ok)(result.saveSpec, `saveSpec is required for ${result.type} type`);
    }
    // Type-specific validation
    // 特定類型的驗證
    switch (result.type) {
        case 'git':
            if (!result.fetchSpec) {
                // Git type requires hosted information
                // Git 類型需要 hosted 資訊
                // assertOk(result.hosted, 'hosted is required for git type');
                (0, assert_1.ok)((0, detect_1.isHostedGitResult)(result), 'hosted.domain is required for git type when fetchSpec is not present');
            }
            else {
                (0, assert_1.ok)(result.fetchSpec, 'fetchSpec is required for git type when hosted is not present');
            }
            break;
        case 'directory':
            // Directory type requires where path
            // Directory 類型需要 where 路徑
            (0, assert_1.ok)(result.where, 'where is required for directory type');
            break;
        case 'range':
            if ((0, detect_1.isRawSpecIsEmpty)(result)) {
                shouldHasName !== null && shouldHasName !== void 0 ? shouldHasName : (shouldHasName = false);
                break;
            }
        case 'file':
        case 'remote':
        case 'tag':
        case 'version':
            (0, assert_1.ok)(result.fetchSpec, `fetchSpec is required for ${result.type} type`);
            break;
        case 'alias':
            (0, assert_1.ok)(result.subSpec, `subSpec is required for ${result.type} type`);
            break;
        default:
            // Other types default to requiring name validation
            // 其他類型預設需要名稱驗證
            shouldHasName !== null && shouldHasName !== void 0 ? shouldHasName : (shouldHasName = true);
            break;
    }
    if (typeof result.scope === 'string') {
        (0, assert_1.ok)(result.scope.charCodeAt(0) === 64, `scope must start with @`);
    }
    if (['range', 'version', 'alias', 'tag'].includes(result.type)) {
        shouldHasName !== null && shouldHasName !== void 0 ? shouldHasName : (shouldHasName = true);
    }
    // Validate name if required
    // 如果需要則驗證名稱
    if (shouldHasName) {
        assertNpaResultHasName(result);
    }
    // assertOk(result.saveSpec, 'saveSpec is required');
}
//# sourceMappingURL=assert.js.map