"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameRealpath = exports.isSymbolicLink = void 0;
var fs_stat_1 = require("fs-stat");
Object.defineProperty(exports, "isSymbolicLink", { enumerable: true, get: function () { return fs_stat_1.isSymbolicLinkSync; } });
var path_is_same_1 = require("path-is-same");
Object.defineProperty(exports, "sameRealpath", { enumerable: true, get: function () { return path_is_same_1.fsSameRealpath; } });
//# sourceMappingURL=util.js.map