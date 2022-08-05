"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnLockStringify = void 0;
const detectYarnLockVersionByObject_1 = require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject");
const detectYarnLockVersion_1 = require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion");
const yarnlock_error_1 = require("@yarn-tool/yarnlock-error");
const yarnlock_parsed_to_json_1 = require("@yarn-tool/yarnlock-parsed-to-json");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
const detect_yarnlock_version_1 = require("@yarn-tool/detect-yarnlock-version");
const v1_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v1");
const v2_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v2");
function yarnLockStringify(yarnlock_old) {
    var _a;
    let verType = (0, detect_yarnlock_version_1.detectYarnLockVersionByParsed)(yarnlock_old);
    if (verType) {
        yarnlock_old = (0, yarnlock_parsed_to_json_1.yarnLockParsedToRawJSON)(yarnlock_old);
    }
    else {
        verType = (0, detectYarnLockVersionByObject_1.detectYarnLockVersionByObject)(yarnlock_old);
    }
    if (verType) {
        switch (verType) {
            case yarnlock_types_1.EnumDetectYarnLock.v3:
            case yarnlock_types_1.EnumDetectYarnLock.v2:
                return (0, v2_1.stringifyYarnLockRawV2)(yarnlock_old);
            case yarnlock_types_1.EnumDetectYarnLock.v1:
                // @ts-ignore
                return (0, v1_1.stringifyYarnLockRawV1)((_a = yarnlock_old.object) !== null && _a !== void 0 ? _a : yarnlock_old);
        }
    }
    else {
        verType = (0, detectYarnLockVersion_1.detectYarnLockVersion)(yarnlock_old);
        if (verType) {
            return yarnlock_old.toString();
        }
    }
    throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
}
exports.yarnLockStringify = yarnLockStringify;
exports.default = yarnLockStringify;
//# sourceMappingURL=index.js.map