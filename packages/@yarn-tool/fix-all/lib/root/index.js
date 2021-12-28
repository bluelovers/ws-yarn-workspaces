"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._fixWsRoot = exports._fixRoot = void 0;
const pkg_hosted_info_1 = require("@yarn-tool/pkg-hosted-info");
const upath2_1 = require("upath2");
const pkg_git_info_1 = require("@yarn-tool/pkg-git-info");
const npm_package_json_loader_1 = require("npm-package-json-loader");
const ws_scope_1 = require("@yarn-tool/ws-scope");
function _fixRoot(options) {
    let { rootData, branch, overwriteHostedGitInfo, hostedGitInfo, targetDir } = options;
    const root_file_package_json = (0, upath2_1.join)(targetDir, 'package.json');
    let root_pkg_json = new npm_package_json_loader_1.PackageJsonLoader(root_file_package_json);
    hostedGitInfo !== null && hostedGitInfo !== void 0 ? hostedGitInfo : (hostedGitInfo = (0, pkg_git_info_1.npmHostedGitInfoLazy)());
    if (hostedGitInfo) {
        (0, pkg_hosted_info_1.fillPkgHostedInfo)(root_pkg_json.data, {
            targetDir,
            rootData,
            hostedGitInfo,
            branch,
            overwriteHostedGitInfo,
        });
        root_pkg_json.write();
    }
    return {
        root_file_package_json,
        root_pkg_json,
        targetDir,
        rootData,
        hostedGitInfo,
        branch,
        overwriteHostedGitInfo,
    };
}
exports._fixRoot = _fixRoot;
function _fixWsRoot(options) {
    var _a;
    if (!((_a = options.rootData.ws) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new Error(`Invalid workspaces`);
    }
    let runtime = _fixRoot({
        ...options,
        targetDir: options.rootData.ws,
    });
    let wss = new ws_scope_1.WorkspacesScope(runtime.rootData.ws);
    wss.syncValue();
    wss.save();
    return runtime;
}
exports._fixWsRoot = _fixWsRoot;
//# sourceMappingURL=index.js.map