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
exports.normalizeName = exports.getCacheRootAsync = exports.getCacheRoot = exports.getCachePathAsync = exports.getCachePath = void 0;
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