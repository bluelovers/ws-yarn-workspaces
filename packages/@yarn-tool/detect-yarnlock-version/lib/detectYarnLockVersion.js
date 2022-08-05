"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._tryParseObject = exports._tryParse = exports.detectYarnLockVersion = exports._detectYarnLockVersionSimple = void 0;
const detectYarnLockVersionByObject_1 = require("./detectYarnLockVersionByObject");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
const yarnlock_parse_raw_1 = require("@yarn-tool/yarnlock-parse-raw");
function _detectYarnLockVersionSimple(buf) {
    const head = buf.slice(0, 160).toString().trim();
    if (head.includes('# yarn lockfile v1')) {
        return yarnlock_types_1.EnumDetectYarnLock.v1;
    }
    else if (/^__metadata:\s*version: (4|5)(?:\r|\n)/m.test(head)) {
        return yarnlock_types_1.EnumDetectYarnLock.v2;
    }
    else if (/^__metadata:\s*version: (\d)(?:\r|\n)/m.test(head)) {
        return yarnlock_types_1.EnumDetectYarnLock.v3;
    }
    return yarnlock_types_1.EnumDetectYarnLock.unknown;
}
exports._detectYarnLockVersionSimple = _detectYarnLockVersionSimple;
function detectYarnLockVersion(buf) {
    return _detectYarnLockVersionSimple(buf) || _tryParse(buf) || yarnlock_types_1.EnumDetectYarnLock.unknown;
}
exports.detectYarnLockVersion = detectYarnLockVersion;
/**
 * only check v2 and v3
 */
function _tryParse(buf) {
    try {
        const yarnLockObject = (0, yarnlock_parse_raw_1.parseYarnLockRawV2)(buf.toString());
        return _tryParseObject(yarnLockObject);
    }
    catch (e) {
    }
}
exports._tryParse = _tryParse;
function _tryParseObject(yarnLockObject) {
    const result = (0, detectYarnLockVersionByObject_1.detectYarnLockVersionByObject)(yarnLockObject);
    return (result === yarnlock_types_1.EnumDetectYarnLock.v2 || result === yarnlock_types_1.EnumDetectYarnLock.v3) ? result : void 0;
}
exports._tryParseObject = _tryParseObject;
exports.default = detectYarnLockVersion;
//# sourceMappingURL=detectYarnLockVersion.js.map