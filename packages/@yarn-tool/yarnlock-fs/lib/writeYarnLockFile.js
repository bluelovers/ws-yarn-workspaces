"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeYarnLockFile = void 0;
const yarnlock_stringify_1 = require("@yarn-tool/yarnlock-stringify");
const fs_extra_1 = require("fs-extra");
function writeYarnLockFile(file, data) {
    return (0, fs_extra_1.writeFileSync)(file, (0, yarnlock_stringify_1.yarnLockStringify)(data));
}
exports.writeYarnLockFile = writeYarnLockFile;
//# sourceMappingURL=writeYarnLockFile.js.map