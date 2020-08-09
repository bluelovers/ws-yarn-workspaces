"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.queryVersionWithCache = exports.queryVersionByNpmPackageArgWithCache = void 0;
const queryVersionByNpmPackageArg_1 = __importDefault(require("./lib/queryVersionByNpmPackageArg"));
exports.queryVersionByNpmPackageArgWithCache = queryVersionByNpmPackageArg_1.default;
const queryVersion_1 = __importDefault(require("./lib/queryVersion"));
exports.queryVersionWithCache = queryVersion_1.default;
const cacheAgent_1 = require("./lib/cacheAgent");
Object.defineProperty(exports, "getCache", { enumerable: true, get: function () { return cacheAgent_1.getCache; } });
exports.default = queryVersion_1.default;
//# sourceMappingURL=index.js.map