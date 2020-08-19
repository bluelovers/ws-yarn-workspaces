"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterInstallDeps = void 0;
const installDepsFromWorkspaces_1 = require("./installDepsFromWorkspaces");
const index_1 = require("@yarn-tool/find-root/index");
function filterInstallDeps(packageNames, options = {}) {
    var _a;
    const cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    if (!options.skipCheckWorkspace) {
        const rootData = index_1.findRoot({
            ...options,
            cwd,
        });
        if (rootData.hasWorkspace && !rootData.isWorkspace) {
            let data = installDepsFromWorkspaces_1.installDepsFromWorkspaces(packageNames, options);
            packageNames = data.others;
            return {
                cwd,
                packageNames,
                pkg: data.pkg,
                rootData,
            };
        }
    }
    return {
        cwd,
        packageNames,
    };
}
exports.filterInstallDeps = filterInstallDeps;
//# sourceMappingURL=installDeps.js.map