"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterInstallDeps = filterInstallDeps;
const installDepsFromWorkspaces_1 = require("./installDepsFromWorkspaces");
const find_root_1 = require("@yarn-tool/find-root");
function filterInstallDeps(packageNames, options = {}) {
    var _a;
    const cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    if (!options.skipCheckWorkspace) {
        const rootData = (0, find_root_1.findRoot)({
            ...options,
            cwd,
        });
        if (rootData.hasWorkspace && !rootData.isWorkspace) {
            let data = (0, installDepsFromWorkspaces_1.installDepsFromWorkspaces)(packageNames, options);
            packageNames = data.others;
            return {
                cwd,
                packageNames,
                pkg: data.pkg,
                rootData,
                added: data.added,
                exists: data.exists,
                updated: data.updated,
            };
        }
    }
    return {
        cwd,
        packageNames,
    };
}
//# sourceMappingURL=installDeps.js.map