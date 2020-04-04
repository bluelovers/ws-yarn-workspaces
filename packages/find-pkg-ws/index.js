"use strict";
/**
 * Created by user on 2018/5/14/014.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const core_1 = __importDefault(require("find-yarn-workspace-root2/core"));
const path_1 = require("path");
function findWorkspacePackageJson(cwd) {
    let ws = core_1.default(cwd || process.cwd());
    if (ws) {
        return path_1.join(ws, 'package.json');
    }
    return null;
}
findWorkspacePackageJson.findPkg = findWorkspacePackageJson;
findWorkspacePackageJson.default = findWorkspacePackageJson;
module.exports = findWorkspacePackageJson;
//# sourceMappingURL=index.js.map