"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModulesDir = void 0;
const upath2_1 = require("upath2");
function getModulesDir(cwd, dir) {
    return (0, upath2_1.join)(cwd, dir !== null && dir !== void 0 ? dir : 'node_modules');
}
exports.getModulesDir = getModulesDir;
//# sourceMappingURL=util.js.map