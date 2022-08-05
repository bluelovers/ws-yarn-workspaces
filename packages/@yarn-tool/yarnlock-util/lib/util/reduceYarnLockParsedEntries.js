"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceYarnLockParsedEntries = void 0;
const yarnlock_parse_assert_1 = require("@yarn-tool/yarnlock-parse-assert");
function reduceYarnLockParsedEntries(alreadyComputedPackage, parsedOldPackage, fn) {
    (0, yarnlock_parse_assert_1.assertYarnLockParsedIsSupported)(parsedOldPackage);
    return Object.entries(parsedOldPackage.data)
        .reduce((alreadyComputedPackage, row, index) => {
        return fn(alreadyComputedPackage, row, index, parsedOldPackage);
    }, alreadyComputedPackage);
}
exports.reduceYarnLockParsedEntries = reduceYarnLockParsedEntries;
//# sourceMappingURL=reduceYarnLockParsedEntries.js.map