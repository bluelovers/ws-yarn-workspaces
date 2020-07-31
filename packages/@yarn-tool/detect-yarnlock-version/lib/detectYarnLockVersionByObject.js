"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkV1 = exports.checkV2 = exports.detectYarnLockVersionByObject = void 0;
const types_1 = require("./types");
function detectYarnLockVersionByObject(yarnLockObject) {
    var _a, _b;
    if (((_b = (_a = yarnLockObject.__metadata) === null || _a === void 0 ? void 0 : _a.version) === null || _b === void 0 ? void 0 : _b.toString()) === '4' && checkV2(yarnLockObject)) {
        return types_1.EnumDetectYarnLock.berry;
    }
    else if (typeof yarnLockObject.type === 'string' && yarnLockObject.object && checkV1(yarnLockObject.object)) {
        return types_1.EnumDetectYarnLock.v1;
    }
    else if (!('type' in yarnLockObject) && !('object' in yarnLockObject) && checkV1(yarnLockObject)) {
        return types_1.EnumDetectYarnLock.v1;
    }
    return types_1.EnumDetectYarnLock.unknown;
}
exports.detectYarnLockVersionByObject = detectYarnLockVersionByObject;
function checkV2(obj) {
    let ks = Object.keys(obj)
        .slice(2)
        .filter(k => k !== '__metadata');
    let k = ks[0];
    if (ks.length && obj[k].version && obj[k].resolution && obj[k].linkType) {
        return types_1.EnumDetectYarnLock.berry;
    }
}
exports.checkV2 = checkV2;
function checkV1(obj) {
    let ks = Object.keys(obj)
        .slice(2);
    let k = ks[0];
    if (ks.length && obj[k].version && obj[k].resolved) {
        return types_1.EnumDetectYarnLock.v1;
    }
}
exports.checkV1 = checkV1;
exports.default = detectYarnLockVersionByObject;
//# sourceMappingURL=detectYarnLockVersionByObject.js.map