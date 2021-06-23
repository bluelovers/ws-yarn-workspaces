"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsYarnLockFile = void 0;
const fs_extra_1 = require("fs-extra");
function existsYarnLockFile(file) {
    return (0, fs_extra_1.pathExistsSync)(file);
}
exports.existsYarnLockFile = existsYarnLockFile;
//# sourceMappingURL=existsYarnLockFile.js.map