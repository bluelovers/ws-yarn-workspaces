"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readYarnLockFile = exports.checkAndParseYarnLockFile = void 0;
const readYarnLockFile_1 = require("./readYarnLockFile");
const parse_1 = require("@yarn-tool/yarnlock/lib/parse");
const fs_extra_1 = require("fs-extra");
const notEmpty_1 = require("./notEmpty");
function checkAndParseYarnLockFile(file, printError) {
    let buf = readYarnLockFile_1.checkAndReadYarnLockFileSafe(file);
    if (notEmpty_1.notEmpty(buf)) {
        try {
            return parse_1.parse(buf);
        }
        catch (e) {
            printError && console.trace(e);
        }
    }
}
exports.checkAndParseYarnLockFile = checkAndParseYarnLockFile;
function readYarnLockFile(file) {
    let buf = fs_extra_1.readFileSync(file);
    return parse_1.parse(buf);
}
exports.readYarnLockFile = readYarnLockFile;
//# sourceMappingURL=readParseYarnLockFile.js.map