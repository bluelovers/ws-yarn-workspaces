"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmAutoFixAll = void 0;
const find_root_1 = require("@yarn-tool/find-root");
const pkg_git_info_1 = require("@yarn-tool/pkg-git-info");
const index_1 = require("./lib/root/index");
const index_2 = require("./lib/pkg/index");
function npmAutoFixAll(cwd, options) {
    cwd !== null && cwd !== void 0 ? cwd : (cwd = process.cwd());
    const rootData = (0, find_root_1.findRootLazy)({
        cwd,
    });
    if (!(rootData === null || rootData === void 0 ? void 0 : rootData.root)) {
        throw new Error(`Invalid workspaces / package: ${cwd}`);
    }
    let { branch, overwriteHostedGitInfo } = options !== null && options !== void 0 ? options : {};
    cwd = rootData.cwd;
    const hostedGitInfo = (0, pkg_git_info_1.npmHostedGitInfoLazy)(cwd);
    if (rootData.hasWorkspace) {
        (0, index_1._fixWsRoot)({
            rootData,
            hostedGitInfo,
            branch,
            overwriteHostedGitInfo,
        });
    }
    else {
        (0, index_1._fixRoot)({
            rootData,
            hostedGitInfo,
            branch,
            overwriteHostedGitInfo,
            targetDir: rootData.root,
        });
    }
    const list = (0, index_2._initPkgListableByRootData)(rootData);
    return (0, index_2._runEachPackages)(list);
}
exports.npmAutoFixAll = npmAutoFixAll;
exports.default = npmAutoFixAll;
//# sourceMappingURL=index.js.map