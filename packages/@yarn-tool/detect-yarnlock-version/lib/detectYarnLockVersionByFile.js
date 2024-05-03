"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersionByFile = detectYarnLockVersionByFile;
exports.detectYarnLockVersionByDir = detectYarnLockVersionByDir;
const detectYarnLockVersion_1 = require("./detectYarnLockVersion");
const fs_1 = require("fs");
const path_1 = require("path");
function detectYarnLockVersionByFile(file) {
    // @ts-ignore
    const fd = (0, fs_1.openSync)(file);
    const buf = Buffer.alloc(160);
    (0, fs_1.readSync)(fd, buf, 0, 160, 0);
    return (0, detectYarnLockVersion_1.detectYarnLockVersion)(buf);
}
function detectYarnLockVersionByDir(dir) {
    return detectYarnLockVersionByFile((0, path_1.join)(dir, 'yarn.lock'));
}
exports.default = detectYarnLockVersionByFile;
//# sourceMappingURL=detectYarnLockVersionByFile.js.map