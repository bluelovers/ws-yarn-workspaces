"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersionByDir = exports.detectYarnLockVersionByFile = void 0;
const tslib_1 = require("tslib");
const detectYarnLockVersion_1 = (0, tslib_1.__importDefault)(require("./detectYarnLockVersion"));
const fs_1 = require("fs");
const path_1 = require("path");
function detectYarnLockVersionByFile(file) {
    // @ts-ignore
    const fd = (0, fs_1.openSync)(file);
    const buf = Buffer.alloc(160);
    (0, fs_1.readSync)(fd, buf, 0, 160, 0);
    return (0, detectYarnLockVersion_1.default)(buf);
}
exports.detectYarnLockVersionByFile = detectYarnLockVersionByFile;
function detectYarnLockVersionByDir(dir) {
    return detectYarnLockVersionByFile((0, path_1.join)(dir, 'yarn.lock'));
}
exports.detectYarnLockVersionByDir = detectYarnLockVersionByDir;
exports.default = detectYarnLockVersionByFile;
//# sourceMappingURL=detectYarnLockVersionByFile.js.map