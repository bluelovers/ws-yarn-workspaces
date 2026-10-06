"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersionByParsed = exports.detectYarnLockVersionByObject = void 0;
const tslib_1 = require("tslib");
/**
 * 套件進入點 (Entrypoint)：重新導出各類 yarn.lock 格式偵測函式。
 *
 * Package entry point: re-exports the various yarn.lock format detection
 * helpers.
 */
tslib_1.__exportStar(require("./lib/detectYarnLockVersion"), exports);
tslib_1.__exportStar(require("./lib/detectYarnLockVersionByFile"), exports);
var detectYarnLockVersionByObject_1 = require("./lib/detectYarnLockVersionByObject");
Object.defineProperty(exports, "detectYarnLockVersionByObject", { enumerable: true, get: function () { return detectYarnLockVersionByObject_1.detectYarnLockVersionByObject; } });
var detectYarnLockVersionByParsed_1 = require("./lib/detectYarnLockVersionByParsed");
Object.defineProperty(exports, "detectYarnLockVersionByParsed", { enumerable: true, get: function () { return detectYarnLockVersionByParsed_1.detectYarnLockVersionByParsed; } });
const detectYarnLockVersion_1 = require("./lib/detectYarnLockVersion");
/**
 * 預設匯出 (Default export) 指向最常用的內容偵測函式，
 * 讓 `import detectYarnLockVersion from ...` 成為最短的使用方式。
 *
 * The default export points to the most commonly used content-based detector,
 * so the shortest import form remains the primary usage.
 */
exports.default = detectYarnLockVersion_1.detectYarnLockVersion;
//# sourceMappingURL=index.js.map