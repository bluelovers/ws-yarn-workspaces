"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSimpleSemVer = mergeSimpleSemVer;
const checker_1 = require("./checker");
const isAllowedMergeAbleValue_1 = require("./util/isAllowedMergeAbleValue");
function mergeSimpleSemVer(target, b) {
    (0, checker_1.assertSimpleSemVerObjectLike)(target);
    (0, checker_1.assertSimpleSemVerObjectLike)(b);
    let changed;
    [
        'major',
        'minor',
        'patch',
        'release',
        'build',
    ].forEach(key => {
        let value1 = target[key];
        let value2 = b[key];
        if ((0, isAllowedMergeAbleValue_1.isAllowedMergeAbleValue)(value1) && (0, isAllowedMergeAbleValue_1.isAllowedMergeAbleValue)(value2)) {
            changed !== null && changed !== void 0 ? changed : (changed = {});
            target[key] = value2;
            changed[key] = value2;
        }
    });
    return {
        target,
        changed,
    };
}
exports.default = mergeSimpleSemVer;
//# sourceMappingURL=mergeSimpleSemVer.js.map