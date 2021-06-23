"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixDuplicates = void 0;
const tslib_1 = require("tslib");
const yarn_berry_deduplicate_1 = require("yarn-berry-deduplicate");
const yarnlock_banner_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/yarnlock-banner"));
function fixDuplicates(yarnlock_old, options) {
    yarnlock_old = yarnlock_old.toString();
    let { banner, content } = (0, yarnlock_banner_1.default)(yarnlock_old);
    let output = (0, yarn_berry_deduplicate_1.fixDuplicates)(content, options);
    return `${banner}${output}`;
}
exports.fixDuplicates = fixDuplicates;
//# sourceMappingURL=fixDuplicates.js.map