"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
const core_1 = require("find-yarn-workspace-root2/core");
const path_1 = require("path");
function findWorkspacePackageJson(cwd) {
    let ws = (0, core_1.findWorkspaceRoot)(cwd || process.cwd());
    if (ws) {
        return (0, path_1.join)(ws, 'package.json');
    }
    return null;
}
findWorkspacePackageJson.findPkg = findWorkspacePackageJson;
findWorkspacePackageJson.default = findWorkspacePackageJson;
module.exports = findWorkspacePackageJson;
//# sourceMappingURL=index.js.map