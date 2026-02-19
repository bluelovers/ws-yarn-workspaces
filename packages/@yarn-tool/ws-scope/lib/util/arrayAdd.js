"use strict";
/**
 * @fileoverview Array Manipulation Utilities for Scope Management
 *
 * Provides utility functions for adding and removing items from arrays
 * while tracking changes. Used for managing workspace scope arrays.
 *
 * @module @yarn-tool/ws-scope/util/arrayAdd
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayAdd = arrayAdd;
exports.arrayRemove = arrayRemove;
const array_hyper_unique_1 = require("array-hyper-unique");
/**
 * Adds a scope path to an array if not already present
 *
 * @param {string} scope - The scope path to add / 2.0
 * @param {string[]} [value=[]] - The array to modify / 2.0
 * @returns {ArrayOperationResult<string>} Result with changed flag and modified array / 2.0
 * @throws {Error} Throws if value is not an array / 2.0
 *
 * @description
 * Adds the scope to the array only if it doesn't already exist.
 * Also ensures uniqueness of all elements in the array.
 *
 * @example
 * ```typescript
 * const result = arrayAdd('packages/*', ['packages/a/*']);
 * // result.changed = true
 * // result.value = ['packages/a/*', 'packages/*']
 * ```
 */
function arrayAdd(scope, value) {
    value !== null && value !== void 0 ? value : (value = []);
    if (!Array.isArray(value)) {
        throw new Error(`Only support Array but ${value}`);
    }
    let changed = false;
    if (!value.includes(scope)) {
        value.push(scope);
        (0, array_hyper_unique_1.array_unique_overwrite)(value);
        changed = true;
    }
    return {
        changed,
        value,
    };
}
/**
 * Removes a scope path from an array if present
 *
 * @param {string} scope - The scope path to remove / 2.0
 * @param {string[]} value - The array to modify / 2.0
 * @returns {ArrayOperationResult<string>} Result with changed flag and modified array / 2.0
 *
 * @description
 * Removes the first occurrence of the scope from the array.
 * Returns the modified array and a flag indicating if a change was made.
 *
 * @example
 * ```typescript
 * const result = arrayRemove('packages/*', ['packages/a/*', 'packages/*']);
 * // result.changed = true
 * // result.value = ['packages/a/*']
 * ```
 */
function arrayRemove(scope, value) {
    let changed = false;
    if (value && value.includes(scope)) {
        let i = value.indexOf(scope);
        value.splice(i, 1);
        changed = true;
    }
    return {
        changed,
        value,
    };
}
//# sourceMappingURL=arrayAdd.js.map