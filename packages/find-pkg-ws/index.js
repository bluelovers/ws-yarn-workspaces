"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
const findYarnWorkspaceRoot = require("find-yarn-workspace-root2");
const path = require("path");
function findWorkspacePackageJson(cwd) {
    let ws = findYarnWorkspaceRoot(cwd || process.cwd());
    if (ws) {
        return path.join(ws, 'package.json');
    }
    return null;
}
findWorkspacePackageJson.findPkg = findWorkspacePackageJson;
findWorkspacePackageJson.default = findWorkspacePackageJson;
module.exports = findWorkspacePackageJson;
//# sourceMappingURL=index.js.map