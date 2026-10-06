"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YarnLockIterator = exports.fromFile = exports.fromFileAsync = exports.fromContent = exports.fromContentAsync = void 0;
const tslib_1 = require("tslib");
/**
 * 公眾 API 匯出層：把迭代器、內容／檔案來源函式與型別集中匯出，
 * 讓使用端從單一入口即可建立 yarn.lock 條目迭代器（SSoT）。
 *
 * Public API barrel: gathers the iterator, content/file sources and types so consumers
 * build yarn.lock entry iterators from a single entry point (SSoT).
 */
const YarnLockIterator_1 = require("./lib/YarnLockIterator");
Object.defineProperty(exports, "YarnLockIterator", { enumerable: true, get: function () { return YarnLockIterator_1.YarnLockIterator; } });
const fromContent_1 = require("./lib/fromContent");
Object.defineProperty(exports, "fromContentAsync", { enumerable: true, get: function () { return fromContent_1.fromContentAsync; } });
Object.defineProperty(exports, "fromContent", { enumerable: true, get: function () { return fromContent_1.fromContent; } });
const fromFile_1 = require("./lib/fromFile");
Object.defineProperty(exports, "fromFileAsync", { enumerable: true, get: function () { return fromFile_1.fromFileAsync; } });
Object.defineProperty(exports, "fromFile", { enumerable: true, get: function () { return fromFile_1.fromFile; } });
tslib_1.__exportStar(require("./lib/types"), exports);
/**
 * 預設匯出 `fromContent`，讓「拿到字串就解析」成為最常見用法的捷徑。
 *
 * Default-exports `fromContent` as the shortcut for the common "string in, entries out" use.
 */
exports.default = fromContent_1.fromContent;
//# sourceMappingURL=index.js.map