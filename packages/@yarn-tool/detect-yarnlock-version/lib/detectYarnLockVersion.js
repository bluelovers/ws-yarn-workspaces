"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._detectYarnLockVersionSimple = _detectYarnLockVersionSimple;
exports._detectYarnLockVersionCore = _detectYarnLockVersionCore;
exports.detectYarnLockVersion = detectYarnLockVersion;
exports._tryParse = _tryParse;
exports._tryParseObject = _tryParseObject;
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
function _detectYarnLockVersionCore(input) {
    let verType = _detectYarnLockVersionSimple(input);
    if (verType) {
        return {
            verType,
            detectType: 1 /* EnumDetectYarnLockInputType.simple */,
            input,
        };
    }
    if (verType = _tryParse(input)) {
        return {
            verType,
            detectType: 2 /* EnumDetectYarnLockInputType.parse_raw */,
            input,
        };
    }
    return {
        verType: yarnlock_types_1.EnumDetectYarnLock.unknown,
        detectType: 0 /* EnumDetectYarnLockInputType.unknown */,
        input,
    };
}
function detectYarnLockVersion(buf) {
    return _detectYarnLockVersionCore(buf).verType;
}
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
function _tryParseObject(yarnLockObject) {
    const result = (0, detectYarnLockVersionByObject_1.detectYarnLockVersionByObject)(yarnLockObject);
    return (result === yarnlock_types_1.EnumDetectYarnLock.v2 || result === yarnlock_types_1.EnumDetectYarnLock.v3) ? result : void 0;
}
exports.default = detectYarnLockVersion;
//# sourceMappingURL=detectYarnLockVersion.js.map