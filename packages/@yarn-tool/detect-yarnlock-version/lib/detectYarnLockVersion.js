"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersion = exports.EnumDetectYarnLock = void 0;
var EnumDetectYarnLock;
(function (EnumDetectYarnLock) {
    EnumDetectYarnLock[EnumDetectYarnLock["v1"] = 1] = "v1";
    EnumDetectYarnLock[EnumDetectYarnLock["v2"] = 2] = "v2";
    EnumDetectYarnLock[EnumDetectYarnLock["berry"] = 2] = "berry";
    EnumDetectYarnLock[EnumDetectYarnLock["unknown"] = 0] = "unknown";
})(EnumDetectYarnLock = exports.EnumDetectYarnLock || (exports.EnumDetectYarnLock = {}));
function detectYarnLockVersion(buf) {
    let head = buf.slice(0, 160).toString();
    if (head.includes('# yarn lockfile v1')) {
        return EnumDetectYarnLock.v1;
    }
    else if (/^__metadata:\s*version: 4(?:\r|\n)/m.test(head)) {
        return EnumDetectYarnLock.berry;
    }
    return EnumDetectYarnLock.unknown;
}
exports.detectYarnLockVersion = detectYarnLockVersion;
exports.default = detectYarnLockVersion;
//# sourceMappingURL=detectYarnLockVersion.js.map