"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModulesDir = getModulesDir;
const upath2_1 = require("upath2");
function getModulesDir(cwd, dir) {
    return (0, upath2_1.join)(cwd, dir !== null && dir !== void 0 ? dir : 'node_modules');
}
//# sourceMappingURL=util.js.map