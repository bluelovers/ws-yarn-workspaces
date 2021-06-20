"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceYarnLockParsedEntries = void 0;
const yarnlock_parse_1 = require("@yarn-tool/yarnlock-parse");
function reduceYarnLockParsedEntries(alreadyComputedPackage, parsedOldPackage, fn) {
    yarnlock_parse_1.assertYarnLockParsedIsSupported(parsedOldPackage);
    return Object.entries(parsedOldPackage.data)
        .reduce((alreadyComputedPackage, row, index) => {
        return fn(alreadyComputedPackage, row, index, parsedOldPackage);
    }, alreadyComputedPackage);
}
exports.reduceYarnLockParsedEntries = reduceYarnLockParsedEntries;
//# sourceMappingURL=reduceYarnLockParsedEntries.js.map