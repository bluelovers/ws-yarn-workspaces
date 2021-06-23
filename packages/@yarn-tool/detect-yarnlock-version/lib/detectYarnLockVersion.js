"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersion = void 0;
const tslib_1 = require("tslib");
const types_1 = require("./types");
const parsers_1 = require("@yarnpkg/parsers");
const detectYarnLockVersionByObject_1 = (0, tslib_1.__importDefault)(require("./detectYarnLockVersionByObject"));
function detectYarnLockVersion(buf) {
    let head = buf.slice(0, 160).toString().trim();
    if (head.includes('# yarn lockfile v1')) {
        return types_1.EnumDetectYarnLock.v1;
    }
    else if (/^__metadata:\s*version: 4(?:\r|\n)/m.test(head)) {
        return types_1.EnumDetectYarnLock.berry;
    }
    else if (tryParse(buf)) {
        return types_1.EnumDetectYarnLock.berry;
    }
    return types_1.EnumDetectYarnLock.unknown;
}
exports.detectYarnLockVersion = detectYarnLockVersion;
function tryParse(buf) {
    try {
        let json = (0, parsers_1.parseSyml)(buf.toString());
        return (0, detectYarnLockVersionByObject_1.default)(json) === types_1.EnumDetectYarnLock.berry;
    }
    catch (e) {
    }
}
exports.default = detectYarnLockVersion;
//# sourceMappingURL=detectYarnLockVersion.js.map