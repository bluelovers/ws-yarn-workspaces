"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixDuplicates = void 0;
const yarn_berry_deduplicate_1 = require("yarn-berry-deduplicate");
function fixDuplicates(yarnlock_old, options) {
    return yarn_berry_deduplicate_1.fixDuplicates(yarnlock_old.toString(), options);
}
exports.fixDuplicates = fixDuplicates;
//# sourceMappingURL=fixDuplicates.js.map