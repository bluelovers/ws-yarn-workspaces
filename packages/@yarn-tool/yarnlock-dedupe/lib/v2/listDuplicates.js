"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDuplicates = void 0;
const yarn_berry_deduplicate_1 = require("yarn-berry-deduplicate");
function listDuplicates(yarnlock_old, options) {
    return (0, yarn_berry_deduplicate_1.listDuplicates)(yarnlock_old.toString(), options);
}
exports.listDuplicates = listDuplicates;
//# sourceMappingURL=listDuplicates.js.map