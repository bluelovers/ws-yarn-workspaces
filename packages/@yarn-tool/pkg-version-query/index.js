"use strict";
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