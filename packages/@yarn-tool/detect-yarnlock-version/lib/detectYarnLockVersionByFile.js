"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersionByDir = exports.detectYarnLockVersionByFile = void 0;
const detectYarnLockVersion_1 = __importDefault(require("./detectYarnLockVersion"));
const fs_1 = require("fs");
const path_1 = require("path");
function detectYarnLockVersionByFile(file) {
    // @ts-ignore
    const fd = fs_1.openSync(file);
    const buf = Buffer.alloc(160);
    fs_1.readSync(fd, buf, 0, 160, 0);
    return detectYarnLockVersion_1.default(buf);
}
exports.detectYarnLockVersionByFile = detectYarnLockVersionByFile;
function detectYarnLockVersionByDir(dir) {
    return detectYarnLockVersionByFile(path_1.join(dir, 'yarn.lock'));
}
exports.detectYarnLockVersionByDir = detectYarnLockVersionByDir;
exports.default = detectYarnLockVersionByFile;
//# sourceMappingURL=detectYarnLockVersionByFile.js.map