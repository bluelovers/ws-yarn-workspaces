"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeYarnLockFile = exports.checkAndReadYarnLockFileSafe = exports.infoFromDedupeCache = exports.wrapDedupe = void 0;
const tslib_1 = require("tslib");
/**
 * 公眾 API 匯出層：把 lib/ 內的型別、核心運算、檔案讀寫、差異比較與去重集中匯出，
 * 讓使用端從單一入口即可取得完整能力，不必記住各子模組的路徑。
 *
 * Public API barrel: re-exports types, core algorithms, fs helpers, diff and dedupe
 * from lib/ so consumers get the full surface from a single entry point instead of
 * memorising sub-module paths.
 */
tslib_1.__exportStar(require("./lib/types"), exports);
tslib_1.__exportStar(require("./lib/core"), exports);
tslib_1.__exportStar(require("./lib/fs"), exports);
tslib_1.__exportStar(require("./lib/util"), exports);
tslib_1.__exportStar(require("./lib/diff"), exports);
tslib_1.__exportStar(require("./lib/dedupe"), exports);
/**
 * wrapDedupe 管線刻意只挑選具名匯出，
 * 讓 handleWrapDedupeOptions 等內部實作細節不會隨 barrel 外洩成公眾 API。
 *
 * The wrapDedupe pipeline is exported by name only, so internal helpers such as
 * handleWrapDedupeOptions do not leak into the public API through the barrel.
 */
var wrapDedupe_1 = require("./lib/wrapDedupe/wrapDedupe");
Object.defineProperty(exports, "wrapDedupe", { enumerable: true, get: function () { return wrapDedupe_1.wrapDedupe; } });
var infoFromDedupeCache_1 = require("./lib/wrapDedupe/infoFromDedupeCache");
Object.defineProperty(exports, "infoFromDedupeCache", { enumerable: true, get: function () { return infoFromDedupeCache_1.infoFromDedupeCache; } });
var readYarnLockFile_1 = require("@yarn-tool/yarnlock-fs/lib/readYarnLockFile");
Object.defineProperty(exports, "checkAndReadYarnLockFileSafe", { enumerable: true, get: function () { return readYarnLockFile_1.checkAndReadYarnLockFileSafe; } });
var writeYarnLockFile_1 = require("@yarn-tool/yarnlock-fs/lib/writeYarnLockFile");
Object.defineProperty(exports, "writeYarnLockFile", { enumerable: true, get: function () { return writeYarnLockFile_1.writeYarnLockFile; } });
/**
 * 以 `exports` 物件本身作為預設匯出，
 * 讓 CJS 使用端既能取得命名匯出，也能在預設匯出上保留完整型別資訊。
 *
 * Default-exports the `exports` object itself so CJS consumers get both the named
 * exports and full type information on the default export.
 */
exports.default = exports;
//# sourceMappingURL=index.js.map