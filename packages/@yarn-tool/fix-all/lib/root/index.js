"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._fixWsRoot = exports._fixRoot = void 0;
const pkg_hosted_info_1 = require("@yarn-tool/pkg-hosted-info");
const upath2_1 = require("upath2");
const pkg_git_info_1 = require("@yarn-tool/pkg-git-info");
const npm_package_json_loader_1 = require("npm-package-json-loader");
const ws_scope_1 = require("@yarn-tool/ws-scope");
const sort_package_json3_1 = require("sort-package-json3");
const ws_root_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/ws-root-scripts");
const dummy_1 = require("@yarn-tool/pkg-entry-util/lib/preset/dummy");
const pkg_deps_add_1 = require("@yarn-tool/pkg-deps-add");
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
        root_pkg_json.data = (0, sort_package_json3_1.sortPackageJson)(root_pkg_json.data);
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
    Object.entries((0, dummy_1.fillDummyScripts)((0, ws_root_scripts_1.defaultWorkspaceRootScripts)())).forEach(([key, value]) => {
        var _a;
        var _b;
        (_a = (_b = runtime.root_pkg_json.data.scripts)[key]) !== null && _a !== void 0 ? _a : (_b[key] = value);
    });
    [
        '@yarn-tool/ws-find-up-paths',
        '@types/node',
        '@bluelovers/tsconfig',
    ].forEach(name => {
        var _a;
        var _b;
        const _check = (0, pkg_deps_add_1._checkDependenciesExistsAll)(runtime.root_pkg_json.data, [
            'devDependencies',
            'dependencies',
        ], name);
        if (!_check._exists) {
            (_a = (_b = runtime.root_pkg_json.data).devDependencies) !== null && _a !== void 0 ? _a : (_b.devDependencies = {});
            runtime.root_pkg_json.data.devDependencies[name] = '*';
        }
    });
    runtime.root_pkg_json.data = (0, sort_package_json3_1.sortPackageJson)(runtime.root_pkg_json.data);
    runtime.root_pkg_json.write();
    let wss = new ws_scope_1.WorkspacesScope(runtime.rootData.ws);
    wss.syncValue();
    wss.save();
    return runtime;
}
exports._fixWsRoot = _fixWsRoot;
//# sourceMappingURL=index.js.map