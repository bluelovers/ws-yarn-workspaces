"use strict";
/**
 * @lazy-node/semver-parse 類型定義
 * Type definitions for @lazy-node/semver-parse
 *
 * 此模組定義了 semver 解析所需的類型系統
 * This module defines the type system required for semver parsing
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumSemverWildcard = exports.EnumOperatorBase = void 0;
/**
 * 基礎運算子列舉
 * Base operator enum
 *
 * 定義 semver 範圍運算子的基本集合
 * Defines the basic set of semver range operators
 */
var EnumOperatorBase;
(function (EnumOperatorBase) {
    /** 相容版本 (Compatible with version) */
    EnumOperatorBase["TILDE"] = "~";
    /** 插入版本 (Caret version) */
    EnumOperatorBase["CARET"] = "^";
    /** 大於等於 (Greater than or equal) */
    EnumOperatorBase["GTE"] = ">=";
    /** 小於等於 (Less than or equal) */
    EnumOperatorBase["LTE"] = "<=";
    /** 等於 (Equal) */
    EnumOperatorBase["EQ"] = "=";
    /** 範圍 (Range) */
    EnumOperatorBase["HYPHEN"] = "-";
    /** 或 (Or) */
    EnumOperatorBase["OR"] = "||";
    /** 相容版本 (Compatible with version, alternative) */
    EnumOperatorBase["TILDE_ALT"] = "~>";
    /** 大於 (Greater than) */
    EnumOperatorBase["GT"] = ">";
    /** 小於 (Less than) */
    EnumOperatorBase["LT"] = "<";
})(EnumOperatorBase || (exports.EnumOperatorBase = EnumOperatorBase = {}));
var EnumSemverWildcard;
(function (EnumSemverWildcard) {
    EnumSemverWildcard["x"] = "x";
    EnumSemverWildcard["star"] = "*";
})(EnumSemverWildcard || (exports.EnumSemverWildcard = EnumSemverWildcard = {}));
//# sourceMappingURL=types.js.map