"use strict";
/**
 * @lazy-node/semver-parse SimpleSemVer 類別
 * SimpleSemVer class for @lazy-node/semver-parse
 *
 * 此模組提供 SimpleSemVer 類別，用於封裝 semver 物件並提供便捷方法
 * This module provides the SimpleSemVer class for encapsulating semver objects with convenient methods
 *
 * **注意：此類別僅支援單一版本範圍，不支援多個版本範圍組合（如 `>=1.0.0 <2.0.0` 或 `^1.0.0 || ^2.0.0`）。**
 * **Note: This class only supports single version range, not multiple version range combinations (e.g., `>=1.0.0 <2.0.0` or `^1.0.0 || ^2.0.0`).**
 *
 * 若需解析多個版本範圍組合，請使用 `parseSimpleSemVerRange` 函數。
 * For parsing multiple version range combinations, use the `parseSimpleSemVerRange` function.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSemVer = void 0;
const stringifySimpleSemVer_1 = require("./stringifySimpleSemVer");
const pruned_1 = require("./util/pruned");
const checker_1 = require("./checker");
const parseSimpleSemVer_1 = require("./parseSimpleSemVer");
/**
 * SimpleSemVer 類別
 * SimpleSemVer class
 *
 * 封裝 semver 物件，提供類型檢查、序列化和轉換方法
 * Encapsulates semver objects, providing type checking, serialization, and conversion methods
 *
 * @template T - semver 類型 / Semver type
 *
 * @example
 * ```typescript
 * // 從版本字串建立 / Create from version string
 * const semver = SimpleSemVer.create('>=1.2.3-beta.1');
 *
 * // 檢查類型 / Check types
 * if (semver.isValidObject()) {
 *   console.log(semver.major); // '1'
 *   console.log(semver.minor); // '2'
 *   console.log(semver.patch); // '3'
 * }
 *
 * // 序列化 / Serialize
 * semver.toString(); // '1.2.3-beta.1'
 * semver.toFullString(); // '>=1.2.3-beta.1'
 * semver.toJSON(); // { operator: '>=', major: '1', ... }
 * ```
 */
class SimpleSemVer {
    /**
     * 建構函式
     * Constructor
     *
     * @param {T} obj - semver 物件 / Semver object
     * @throws {TypeError} 當物件不是有效的 semver 物件或運算子時 / When object is not a valid semver object or operator
     */
    constructor(obj) {
        (0, checker_1.assertSimpleSemVerObjectOrOperatorLike)(obj);
        // @ts-ignore
        (0, pruned_1.prunedSimpleSemVer)(obj, this);
    }
    /**
     * 從版本字串建立 SimpleSemVer 實例
     * Create SimpleSemVer instance from version string
     *
     * 靜態工廠方法，解析版本字串並建立新實例
     * Static factory method that parses version string and creates new instance
     *
     * @template T - semver 類型 / Semver type
     * @param {string} version - 版本字串 / Version string
     * @returns {IToSimpleSemVerObjectOrOperator<SimpleSemVer<T>>} SimpleSemVer 實例 / SimpleSemVer instance
     *
     * @example
     * ```typescript
     * const semver = SimpleSemVer.create('>=1.2.3');
     * const operatorOnly = SimpleSemVer.create('||');
     * ```
     */
    static create(version) {
        return new this((0, parseSimpleSemVer_1.parseSimpleSemVer)(version));
    }
    /**
     * 檢查是否為有效的 semver 物件或運算子
     * Check if it's a valid semver object or operator
     *
     * @returns {boolean} 是否有效 / Whether it's valid
     */
    isValid() {
        return (0, checker_1.isSimpleSemVerObjectOrOperatorLike)(this);
    }
    /**
     * 檢查是否為純運算子
     * Check if it's a pure operator
     *
     * @returns {boolean} 是否為運算子 / Whether it's an operator
     */
    isValidOperator() {
        return (0, checker_1.isSimpleSemVerOperatorLike)(this);
    }
    /**
     * 檢查是否為有效的版本物件
     * Check if it's a valid version object
     *
     * @returns {boolean} 是否為版本物件 / Whether it's a version object
     */
    isValidObject() {
        return (0, checker_1.isSimpleSemVerObjectLike)(this);
    }
    /**
     * 檢查是否具有運算子
     * Check if it has an operator
     *
     * @returns {boolean} 是否具有運算子 / Whether it has an operator
     */
    hasOperator() {
        return (0, checker_1.hasOperator)(this);
    }
    /**
     * 轉換為 JSON 物件
     * Convert to JSON object
     *
     * 移除所有 undefined 屬性，返回純粹的 semver 物件
     * Removes all undefined properties, returns a pure semver object
     *
     * @returns {T} JSON 物件 / JSON object
     */
    toJSON() {
        return (0, pruned_1.prunedSimpleSemVer)(this);
    }
    /**
     * 轉換為版本字串
     * Convert to version string
     *
     * 返回不含運算子的版本字串
     * Returns version string without operator
     *
     * @returns {string} 版本字串 / Version string
     */
    toString() {
        return (0, stringifySimpleSemVer_1.stringifySimpleSemVer)(this);
    }
    /**
     * 轉換為完整版本字串
     * Convert to full version string
     *
     * 返回包含運算子的完整版本字串
     * Returns full version string including operator
     *
     * @returns {string} 完整版本字串 / Full version string
     */
    toFullString() {
        var _a;
        return ((_a = this.operator) !== null && _a !== void 0 ? _a : '') + this.toString();
    }
}
exports.SimpleSemVer = SimpleSemVer;
exports.default = SimpleSemVer;
//# sourceMappingURL=SimpleSemVer.js.map