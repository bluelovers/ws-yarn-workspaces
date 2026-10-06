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
    /**
     * 檢查結果是否具有有效的非空名稱
     * Check whether the result carries a valid non-empty name
     */
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
    /**
     * 先比對型別是否符合預期，錯誤訊息需帶上實際型別便於除錯
     * Compare the actual type against the expected one first; the message carries the actual type for debugging
     */
    (0, assert_1.strictEqual)(result.type, type, `Invalid type: ${result.type}`);
    /**
     * 型別符合後再執行一般性驗證（名稱、saveSpec 等），確保結果整體可用
     * Once the type matches, run the general validations (name, saveSpec, ...) so the result is usable as a whole
     */
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
    /**
     * 以 `&&` 短路：只有呼叫端提供白名單時才驗證型別，
     * 未提供 allowedType 表示接受所有型別
     *
     * The `&&` short-circuits: the type is only checked when the caller supplied a whitelist;
     * a missing `allowedType` means every type is accepted
     */
    (allowedType === null || allowedType === void 0 ? void 0 : allowedType.length) && (0, assert_1.ok)(allowedType.includes(result.type), `Type '${result.type}' not allowed, only allow [${allowedType.join(', ')}]`);
    /**
     * registry 類型（range、version、alias、tag）由 npa 正規化出 fetchSpec，不需 saveSpec；
     * 其餘類型（git、file、remote、directory...）必須有 saveSpec 才能保存到 package.json 並再次取得
     *
     * Registry types (range, version, alias, tag) are normalized to `fetchSpec` by npa and need no
     * `saveSpec`; every other type (git, file, remote, directory, ...) requires one so it can be
     * written to package.json and fetched again
     */
    if (!['range', 'version', 'alias', 'tag'].includes(result.type)) {
        (0, assert_1.ok)(result.saveSpec, `saveSpec is required for ${result.type} type`);
    }
    /**
     * 依型別進行的特定驗證 / Type-specific validation
     */
    switch (result.type) {
        case 'git':
            /**
             * git 型別分兩路驗證：缺少 fetchSpec 時改依賴託管平台資訊；
             * 有 fetchSpec 時（else 分支此處恆真）保留防禦性斷言以維持舊版行為
             *
             * Two validation paths for git: without `fetchSpec` the result must rely on hosting
             * info; the else branch (always true here) keeps a defensive assertion for
             * backward compatibility
             */
            if (!result.fetchSpec) {
                /**
                 * 舊寫法只檢查 result.hosted，已註解保留；現改以 isHostedGitResult 確認 hosted.domain
                 * The old check only looked at `result.hosted` and is kept commented out;
                 * isHostedGitResult now confirms `hosted.domain` as well
                 */
                // assertOk(result.hosted, 'hosted is required for git type');
                (0, assert_1.ok)((0, detect_1.isHostedGitResult)(result), 'hosted.domain is required for git type when fetchSpec is not present');
            }
            else {
                (0, assert_1.ok)(result.fetchSpec, 'fetchSpec is required for git type when hosted is not present');
            }
            break;
        case 'directory':
            /**
             * Directory 類型需要 where 路徑：目錄規格相對於 where 解析，缺少時無法還原實際位置
             * Directory type requires the `where` path: the directory spec resolves relative to it,
             * so without it the real location cannot be recovered
             */
            (0, assert_1.ok)(result.where, 'where is required for directory type');
            break;
        case 'range':
            /**
             * rawSpec 為空或只有空白（輸入 ''、' '、'fake@ '）時，輸入可能根本沒有套件名稱，
             * 照常執行名稱驗證會直接拋錯，故預設改為不強制名稱驗證；
             * `??=` 仍保留呼叫端明確設定的 shouldHasName
             *
             * When `rawSpec` is empty or whitespace only (inputs `''`, `' '`, `'fake@ '`), the input
             * may not name a package at all and a name check would throw right away, so name
             * validation is relaxed by default; `??=` still honours an explicit `shouldHasName`
             * from the caller
             *
             * 此分支刻意不加 break：rawSpec 非空的 range（如 'lodash@^4.0.0'、'fake@'）
             * 會 fall through 到下方共用的 fetchSpec 驗證
             *
             * This branch intentionally omits `break`: a `range` with a non-empty rawSpec
             * (e.g. 'lodash@^4.0.0', 'fake@') falls through to the shared `fetchSpec` check below
             */
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
            /**
             * 目前 IResultType 已在上方全數列出，此分支屬防禦性保留；
             * 未來新增型別時預設要求名稱驗證，避免遺漏驗證
             *
             * Every current IResultType is listed above, so this branch is kept defensively;
             * a future type will default to requiring name validation rather than skipping it
             */
            shouldHasName !== null && shouldHasName !== void 0 ? shouldHasName : (shouldHasName = true);
            break;
    }
    /**
     * scope 存在時必須以 "@" 開頭（64 為 "@" 的字元碼），
     * 確保名稱已經過 npa 正規化，避免未帶前綴的 scope 流入依賴值
     *
     * When `scope` exists it must start with "@" (64 is the char code of "@"), which guarantees
     * the name came through npa's normalization and that a prefix-less scope never leaks downstream
     */
    if (typeof result.scope === 'string') {
        (0, assert_1.ok)(result.scope.charCodeAt(0) === 64, `scope must start with @`);
    }
    /**
     * registry 來源的型別（range、version、alias、tag）必然帶有名稱，
     * 因此預設要求名稱驗證；`??=` 仍允許呼叫端明確關閉
     *
     * Registry-sourced types (range, version, alias, tag) always carry a name, so name validation
     * is required by default; `??=` still lets the caller turn it off explicitly
     */
    if (['range', 'version', 'alias', 'tag'].includes(result.type)) {
        shouldHasName !== null && shouldHasName !== void 0 ? shouldHasName : (shouldHasName = true);
    }
    /**
     * 前述各分支只決定 shouldHasName，最後統一在此執行名稱驗證
     * The branches above only decide `shouldHasName`; the name check runs here in one place
     */
    if (shouldHasName) {
        assertNpaResultHasName(result);
    }
    // assertOk(result.saveSpec, 'saveSpec is required');
}
//# sourceMappingURL=assert.js.map