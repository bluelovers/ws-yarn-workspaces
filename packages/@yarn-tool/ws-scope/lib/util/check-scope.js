"use strict";
/**
 * @fileoverview Scope Path Validation Utility - 2.0
 *
 * Provides validation functions to ensure workspace scope paths are valid
 * and safe (i.e., within the workspace root directory).
 *
 * @module @yarn-tool/ws-scope/util/check-scope
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertScopePath = assertScopePath;
const upath2_1 = require("upath2");
const path_in_dir_1 = require("path-in-dir");
/**
 * Asserts that a scope path is valid and within the workspace root
 *
 * @param {string} scope - The scope path to validate / 2.0
 * @param {string} __root - The workspace root directory / 2.0
 * @throws {Error} Throws if scope is empty or invalid / 2.0
 * @throws {Error} Throws if resolved path is outside workspace root / 2.0
 *
 * @description
 * Validates that:
 * 1. The scope path is not empty
 * 2. The resolved path is inside the workspace root directory
 *
 * This prevents directory traversal attacks and ensures all workspace
 * paths are contained within the project.
 *
 * @example
 * ```typescript
 * assertScopePath('packages/*', '/workspace/root'); // OK
 * assertScopePath('../outside', '/workspace/root'); // Throws Error
 * ```
 */
function assertScopePath(scope, __root) {
    if (!(scope === null || scope === void 0 ? void 0 : scope.length)) {
        throw new Error(`Invalid scope: ${scope}`);
    }
    const __dir = (0, upath2_1.resolve)(__root, scope);
    if (!(0, path_in_dir_1.pathInsideDirectory)(__dir, __root)) {
        throw new Error(`Invalid path: ${__dir}`);
    }
}
//# sourceMappingURL=check-scope.js.map