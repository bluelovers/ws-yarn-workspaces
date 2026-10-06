"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeYarnLockFile = exports.checkAndReadYarnLockFileSafe = void 0;
/**
 * yarn.lock 檔案操作的轉出口：實作位於相依套件 @yarn-tool/yarnlock-fs，
 * 此處僅 re-export，讓使用端維持單一 import 來源（SSoT）而不必記住跨套件路徑。
 *
 * fs re-exports for yarn.lock: implementation lives in the @yarn-tool/yarnlock-fs
 * dependency; re-exported here so consumers keep a single import source (SSoT)
 * without memorising cross-package paths.
 */
const readYarnLockFile_1 = require("@yarn-tool/yarnlock-fs/lib/readYarnLockFile");
Object.defineProperty(exports, "checkAndReadYarnLockFileSafe", { enumerable: true, get: function () { return readYarnLockFile_1.checkAndReadYarnLockFileSafe; } });
const writeYarnLockFile_1 = require("@yarn-tool/yarnlock-fs/lib/writeYarnLockFile");
Object.defineProperty(exports, "writeYarnLockFile", { enumerable: true, get: function () { return writeYarnLockFile_1.writeYarnLockFile; } });
//# sourceMappingURL=fs.js.map