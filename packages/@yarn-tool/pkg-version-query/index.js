"use strict";
/**
 * @yarn-tool/pkg-version-query
 *
 * Query package versions from npm registry with LRU cache support.
 * 從 npm registry 查詢套件版本，支援 LRU 快取機制。
 *
 * @packageDocumentation
 *
 * @example
 * ```ts
 * import queryVersionWithCache from '@yarn-tool/pkg-version-query';
 *
 * // Query latest version
 * const version = await queryVersionWithCache('lodash');
 *
 * // Query specific version range
 * const version = await queryVersionWithCache('typescript', '^4.0.0');
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.queryVersionWithCache = exports.queryVersionByNpmPackageArgWithCache = void 0;
const queryVersionByNpmPackageArg_1 = require("./lib/queryVersionByNpmPackageArg");
Object.defineProperty(exports, "queryVersionByNpmPackageArgWithCache", { enumerable: true, get: function () { return queryVersionByNpmPackageArg_1.queryVersionByNpmPackageArgWithCache; } });
const queryVersion_1 = require("./lib/queryVersion");
Object.defineProperty(exports, "queryVersionWithCache", { enumerable: true, get: function () { return queryVersion_1.queryVersionWithCache; } });
const cacheAgent_1 = require("./lib/cacheAgent");
Object.defineProperty(exports, "getCache", { enumerable: true, get: function () { return cacheAgent_1.getCache; } });
exports.default = queryVersion_1.queryVersionWithCache;
//# sourceMappingURL=index.js.map