"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixDuplicates = void 0;
const yarn_berry_deduplicate_1 = require("yarn-berry-deduplicate");
const yarnlock_banner_1 = require("@yarn-tool/yarnlock-banner");
function fixDuplicates(yarnlock_old, options) {
    yarnlock_old = yarnlock_old.toString();
    const { banner, content } = (0, yarnlock_banner_1.existsYarnLockBanner)(yarnlock_old);
    const output = (0, yarn_berry_deduplicate_1.fixDuplicates)(content, options);
    return `${banner}${output}`;
}
exports.fixDuplicates = fixDuplicates;
//# sourceMappingURL=fixDuplicates.js.map