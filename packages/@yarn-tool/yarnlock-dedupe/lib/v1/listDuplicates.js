"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDuplicates = listDuplicates;
const yarn_deduplicate_1 = require("yarn-deduplicate");
function listDuplicates(yarnlock_old, options) {
    return (0, yarn_deduplicate_1.listDuplicates)(yarnlock_old.toString(), options);
}
//# sourceMappingURL=listDuplicates.js.map