"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOrder = exports.findOSTempPath = exports.findNpmCachePath = exports.findYarnCachePath = exports.findPkgModulePath = exports.findPkgModuleCachePath = void 0;
const findPkgModuleCachePath_1 = require("./finder/findPkgModuleCachePath");
Object.defineProperty(exports, "findPkgModuleCachePath", { enumerable: true, get: function () { return findPkgModuleCachePath_1.findPkgModuleCachePath; } });
Object.defineProperty(exports, "findPkgModulePath", { enumerable: true, get: function () { return findPkgModuleCachePath_1.findPkgModulePath; } });
const findYarnCachePath_1 = require("./finder/findYarnCachePath");
Object.defineProperty(exports, "findYarnCachePath", { enumerable: true, get: function () { return findYarnCachePath_1.findYarnCachePath; } });
const findNpmCachePath_1 = require("./finder/findNpmCachePath");
Object.defineProperty(exports, "findNpmCachePath", { enumerable: true, get: function () { return findNpmCachePath_1.findNpmCachePath; } });
const findOSTempPath_1 = require("./finder/findOSTempPath");
Object.defineProperty(exports, "findOSTempPath", { enumerable: true, get: function () { return findOSTempPath_1.findOSTempPath; } });
/**
 * fn[] of any function return a string
 * stop when get first return
 */
exports.defaultOrder = [
    findPkgModuleCachePath_1.findPkgModulePath,
    findYarnCachePath_1.findYarnCachePath,
    findNpmCachePath_1.findNpmCachePath,
    findOSTempPath_1.findOSTempPath,
];
//# sourceMappingURL=finder.js.map