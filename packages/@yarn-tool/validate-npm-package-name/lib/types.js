"use strict";
/**
 * npm 套件名稱驗證的共用型別與正規表示式
 * Shared types and regexp for npm package name validation
 *
 * @module @yarn-tool/validate-npm-package-name/lib/types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopedPackagePattern = void 0;
/**
 * 命中 scoped 套件（@scope/name）的正規表示式
 * Regexp that matches scoped package names (@scope/name)
 *
 * scope 與 name 都刻意允許任意非斜線字元，
 * 因為是否合法交由驗證規則決定，此處只負責切分。
 * Both scope and name deliberately allow any non-slash characters,
 * because validity is decided by the rules; this pattern only splits the parts.
 */
exports.scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$');
//# sourceMappingURL=types.js.map