"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsYarnLockSafe = exports.writeYarnLockFile = exports.checkAndReadYarnLockFileSafe = void 0;
/**
 * 公眾 API 匯出層：集中匯出 yarn.lock 的讀取、寫入與回傳型別，
 * 讓使用端從單一入口完成檔案操作（SSoT）。
 *
 * Public API barrel: gathers yarn.lock read, write and return types so consumers finish
 * file operations from a single entry point (SSoT).
 */
const readYarnLockFile_1 = require("./lib/readYarnLockFile");
Object.defineProperty(exports, "checkAndReadYarnLockFileSafe", { enumerable: true, get: function () { return readYarnLockFile_1.checkAndReadYarnLockFileSafe; } });
const writeYarnLockFile_1 = require("./lib/writeYarnLockFile");
Object.defineProperty(exports, "writeYarnLockFile", { enumerable: true, get: function () { return writeYarnLockFile_1.writeYarnLockFile; } });
const read_1 = require("./lib/read");
Object.defineProperty(exports, "fsYarnLockSafe", { enumerable: true, get: function () { return read_1.fsYarnLockSafe; } });
/**
 * 預設匯出 `fsYarnLockSafe`，讓「根目錄 → 讀取結果」成為最常見用法的捷徑。
 *
 * Default-exports `fsYarnLockSafe` as the shortcut for the common "root → read result" use.
 */
exports.default = read_1.fsYarnLockSafe;
//# sourceMappingURL=index.js.map