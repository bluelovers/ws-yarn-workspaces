"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDuplicates = listDuplicates;
exports.fixDuplicates = fixDuplicates;
exports.yarnDedupeFile = yarnDedupeFile;
exports.yarnDedupe = yarnDedupe;
const tslib_1 = require("tslib");
const detectYarnLockVersion_1 = require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion");
const v2_1 = tslib_1.__importDefault(require("./lib/v2"));
const v1_1 = tslib_1.__importDefault(require("./lib/v1"));
const fs_1 = require("fs");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
function listDuplicates(yarnlock_old, options) {
    yarnlock_old = yarnlock_old.toString();
    let verType = (0, detectYarnLockVersion_1.detectYarnLockVersion)(yarnlock_old);
    switch (verType) {
        case yarnlock_types_1.EnumDetectYarnLock.v3:
        case yarnlock_types_1.EnumDetectYarnLock.v2:
            return v2_1.default.listDuplicates(yarnlock_old, options);
        case yarnlock_types_1.EnumDetectYarnLock.v1:
            return v1_1.default.listDuplicates(yarnlock_old, options);
    }
    throw new TypeError(`can't detect yarn.lock version`);
}
function fixDuplicates(yarnlock_old, options) {
    yarnlock_old = yarnlock_old.toString();
    let verType = (0, detectYarnLockVersion_1.detectYarnLockVersion)(yarnlock_old);
    switch (verType) {
        case yarnlock_types_1.EnumDetectYarnLock.v3:
        case yarnlock_types_1.EnumDetectYarnLock.v2:
            return v2_1.default.fixDuplicates(yarnlock_old, options);
        case yarnlock_types_1.EnumDetectYarnLock.v1:
            return v1_1.default.fixDuplicates(yarnlock_old, options);
    }
    throw new TypeError(`can't detect yarn.lock version`);
}
function yarnDedupeFile(yarnlock_old_file, options) {
    return yarnDedupe((0, fs_1.readFileSync)(yarnlock_old_file), options);
}
function yarnDedupe(yarnlock_old, options) {
    yarnlock_old = yarnlock_old.toString();
    const yarnlock_new = fixDuplicates(yarnlock_old, options);
    return {
        /**
         * 執行前的 yarn.lock
         */
        yarnlock_old,
        /**
         * 執行後的 yarn.lock
         */
        yarnlock_new,
        /**
         * yarn.lock 是否有變動
         */
        yarnlock_changed: yarnlock_old !== yarnlock_new,
    };
}
const auto = {
    listDuplicates,
    fixDuplicates,
    yarnDedupe,
};
exports.default = auto;
//# sourceMappingURL=index.js.map