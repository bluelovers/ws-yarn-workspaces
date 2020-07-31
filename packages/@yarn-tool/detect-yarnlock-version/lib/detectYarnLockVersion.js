"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersion = void 0;
const types_1 = require("./types");
function detectYarnLockVersion(buf) {
    let head = buf.slice(0, 160).toString().trim();
    if (head.includes('# yarn lockfile v1')) {
        return types_1.EnumDetectYarnLock.v1;
    }
    else if (/^__metadata:\s*version: 4(?:\r|\n)/m.test(head)) {
        return types_1.EnumDetectYarnLock.berry;
    }
    return types_1.EnumDetectYarnLock.unknown;
}
exports.detectYarnLockVersion = detectYarnLockVersion;
exports.default = detectYarnLockVersion;
//# sourceMappingURL=detectYarnLockVersion.js.map