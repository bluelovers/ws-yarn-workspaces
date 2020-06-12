"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWorkspaces = void 0;
const listpkg_1 = require("ws-pkg-list/lib/listpkg");
const pkg_1 = require("./pkg");
function checkWorkspaces(cwd = process.cwd()) {
    return listpkg_1.workspacesPackagesList(cwd)
        .map(cwd => pkg_1.checkPkgDir(cwd));
}
exports.checkWorkspaces = checkWorkspaces;
//# sourceMappingURL=ws.js.map