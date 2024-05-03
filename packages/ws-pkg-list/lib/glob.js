"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globFilterListable = globFilterListable;
const micromatch_1 = require("micromatch");
function globFilterListable(list, globPattern, globOptions) {
    return list.filter(row => {
        return (0, micromatch_1.isMatch)(row.name, globPattern, globOptions);
    });
}
//# sourceMappingURL=glob.js.map