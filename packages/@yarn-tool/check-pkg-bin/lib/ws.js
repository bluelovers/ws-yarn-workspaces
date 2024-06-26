"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWorkspaces = checkWorkspaces;
const listpkg_1 = require("ws-pkg-list/lib/listpkg");
const pkg_1 = require("./pkg");
function checkWorkspaces(cwd = process.cwd()) {
    return (0, listpkg_1.workspacesPackagesList)(cwd)
        .map(cwd => (0, pkg_1.checkPkgDir)(cwd));
}
//# sourceMappingURL=ws.js.map