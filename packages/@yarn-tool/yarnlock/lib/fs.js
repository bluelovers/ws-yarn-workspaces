"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeYarnLockFile = exports.checkAndReadYarnLockFileSafe = void 0;
const readYarnLockFile_1 = require("@yarn-tool/yarnlock-fs/lib/readYarnLockFile");
Object.defineProperty(exports, "checkAndReadYarnLockFileSafe", { enumerable: true, get: function () { return readYarnLockFile_1.checkAndReadYarnLockFileSafe; } });
const writeYarnLockFile_1 = require("@yarn-tool/yarnlock-fs/lib/writeYarnLockFile");
Object.defineProperty(exports, "writeYarnLockFile", { enumerable: true, get: function () { return writeYarnLockFile_1.writeYarnLockFile; } });
//# sourceMappingURL=fs.js.map