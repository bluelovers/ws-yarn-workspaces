"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOSTempPath = exports.findNpmCachePath = exports.findYarnCachePath = exports.findPkgModulePath = exports.findPkgModuleCachePath = exports.normalizeName = exports.getCacheRootAsync = exports.getCacheRoot = exports.getCachePathAsync = exports.getCachePath = void 0;
const findNpmCachePath_1 = require("./lib/finder/findNpmCachePath");
Object.defineProperty(exports, "findNpmCachePath", { enumerable: true, get: function () { return findNpmCachePath_1.findNpmCachePath; } });
const findOSTempPath_1 = require("./lib/finder/findOSTempPath");
Object.defineProperty(exports, "findOSTempPath", { enumerable: true, get: function () { return findOSTempPath_1.findOSTempPath; } });
const findPkgModuleCachePath_1 = require("./lib/finder/findPkgModuleCachePath");
Object.defineProperty(exports, "findPkgModuleCachePath", { enumerable: true, get: function () { return findPkgModuleCachePath_1.findPkgModuleCachePath; } });
Object.defineProperty(exports, "findPkgModulePath", { enumerable: true, get: function () { return findPkgModuleCachePath_1.findPkgModulePath; } });
const findYarnCachePath_1 = require("./lib/finder/findYarnCachePath");
Object.defineProperty(exports, "findYarnCachePath", { enumerable: true, get: function () { return findYarnCachePath_1.findYarnCachePath; } });
const getCachePath_1 = require("./lib/getCachePath");
var getCachePath_2 = require("./lib/getCachePath");
Object.defineProperty(exports, "getCachePath", { enumerable: true, get: function () { return getCachePath_2.getCachePath; } });
Object.defineProperty(exports, "getCachePathAsync", { enumerable: true, get: function () { return getCachePath_2.getCachePathAsync; } });
var getCacheRoot_1 = require("./lib/getCacheRoot");
Object.defineProperty(exports, "getCacheRoot", { enumerable: true, get: function () { return getCacheRoot_1.getCacheRoot; } });
Object.defineProperty(exports, "getCacheRootAsync", { enumerable: true, get: function () { return getCacheRoot_1.getCacheRootAsync; } });
var normalizeName_1 = require("./lib/normalizeName");
Object.defineProperty(exports, "normalizeName", { enumerable: true, get: function () { return normalizeName_1.normalizeName; } });
__exportStar(require("./lib/types"), exports);
exports.default = getCachePath_1.getCachePath;
//# sourceMappingURL=index.js.map