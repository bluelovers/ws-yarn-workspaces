"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.queryVersionWithCache = exports.queryVersionByNpmPackageArgWithCache = void 0;
const tslib_1 = require("tslib");
const queryVersionByNpmPackageArg_1 = (0, tslib_1.__importDefault)(require("./lib/queryVersionByNpmPackageArg"));
exports.queryVersionByNpmPackageArgWithCache = queryVersionByNpmPackageArg_1.default;
const queryVersion_1 = (0, tslib_1.__importDefault)(require("./lib/queryVersion"));
exports.queryVersionWithCache = queryVersion_1.default;
const cacheAgent_1 = require("./lib/cacheAgent");
Object.defineProperty(exports, "getCache", { enumerable: true, get: function () { return cacheAgent_1.getCache; } });
exports.default = queryVersion_1.default;
//# sourceMappingURL=index.js.map