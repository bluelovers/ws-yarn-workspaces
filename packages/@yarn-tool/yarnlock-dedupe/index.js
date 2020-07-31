"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnDedupe = exports.fixDuplicates = exports.listDuplicates = void 0;
const detectYarnLockVersion_1 = __importDefault(require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion"));
const types_1 = require("@yarn-tool/detect-yarnlock-version/lib/types");
const v2_1 = __importDefault(require("./lib/v2"));
const v1_1 = __importDefault(require("./lib/v1"));
function listDuplicates(yarnlock_old, options) {
    yarnlock_old = yarnlock_old.toString();
    let verType = detectYarnLockVersion_1.default(yarnlock_old);
    switch (verType) {
        case types_1.EnumDetectYarnLock.berry:
            return v2_1.default.listDuplicates(yarnlock_old, options);
        case types_1.EnumDetectYarnLock.v1:
            return v1_1.default.listDuplicates(yarnlock_old, options);
    }
    throw new TypeError(`can't detect yarn.lock version`);
}
exports.listDuplicates = listDuplicates;
function fixDuplicates(yarnlock_old, options) {
    yarnlock_old = yarnlock_old.toString();
    let verType = detectYarnLockVersion_1.default(yarnlock_old);
    switch (verType) {
        case types_1.EnumDetectYarnLock.berry:
            return v2_1.default.fixDuplicates(yarnlock_old, options);
        case types_1.EnumDetectYarnLock.v1:
            return v1_1.default.fixDuplicates(yarnlock_old, options);
    }
    throw new TypeError(`can't detect yarn.lock version`);
}
exports.fixDuplicates = fixDuplicates;
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
exports.yarnDedupe = yarnDedupe;
const auto = {
    listDuplicates,
    fixDuplicates,
    yarnDedupe,
};
exports.default = auto;
//# sourceMappingURL=index.js.map