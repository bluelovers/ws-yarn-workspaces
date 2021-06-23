"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globFilterListable = void 0;
const micromatch_1 = require("micromatch");
function globFilterListable(list, globPattern, globOptions) {
    return list.filter(row => {
        return (0, micromatch_1.isMatch)(row.name, globPattern, globOptions);
    });
}
exports.globFilterListable = globFilterListable;
//# sourceMappingURL=glob.js.map