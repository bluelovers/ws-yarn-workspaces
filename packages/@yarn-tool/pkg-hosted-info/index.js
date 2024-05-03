"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._hostedGitInfoToFields = _hostedGitInfoToFields;
exports.fillPkgHostedInfo = fillPkgHostedInfo;
const find_root_1 = require("@yarn-tool/find-root");
const upath2_1 = require("upath2");
const pkg_git_info_1 = require("@yarn-tool/pkg-git-info");
function _hostedGitInfoToFields(pkg, options) {
    let { targetDir, rootData, branch, hostedGitInfo, overwriteHostedGitInfo } = options;
    let directory;
    if ((rootData === null || rootData === void 0 ? void 0 : rootData.hasWorkspace) && !(rootData === null || rootData === void 0 ? void 0 : rootData.isWorkspace)) {
        directory = (0, upath2_1.relative)(rootData.ws, targetDir);
    }
    if (overwriteHostedGitInfo) {
        pkg.homepage = hostedGitInfo.homepage;
        pkg.bugs = {
            url: hostedGitInfo.bugs,
        };
        pkg.repository = {
            "type": "git",
            url: hostedGitInfo.repository,
            directory,
        };
    }
    else {
        // @ts-ignore
        pkg.homepage || (pkg.homepage = hostedGitInfo.homepage);
        // @ts-ignore
        pkg.bugs || (pkg.bugs = {
            url: hostedGitInfo.bugs,
        });
        // @ts-ignore
        pkg.repository || (pkg.repository = {
            "type": "git",
            url: hostedGitInfo.repository,
            directory,
        });
    }
    if (directory === null || directory === void 0 ? void 0 : directory.length) {
        branch !== null && branch !== void 0 ? branch : (branch = 'master');
        let u = new URL(pkg.homepage);
        u.pathname += `/tree/${branch}/` + directory;
        // @ts-ignore
        pkg.homepage = u.toString();
    }
    return pkg;
}
function fillPkgHostedInfo(pkg, options) {
    if ((options === null || options === void 0 ? void 0 : options.overwriteHostedGitInfo) || !pkg.homepage || !pkg.bugs || !pkg.repository) {
        let { targetDir, rootData, branch, hostedGitInfo } = options !== null && options !== void 0 ? options : {};
        rootData !== null && rootData !== void 0 ? rootData : (rootData = (0, find_root_1.findRootLazy)({
            cwd: targetDir,
        }));
        targetDir !== null && targetDir !== void 0 ? targetDir : (targetDir = rootData.pkg);
        hostedGitInfo !== null && hostedGitInfo !== void 0 ? hostedGitInfo : (hostedGitInfo = (0, pkg_git_info_1.npmHostedGitInfoLazy)(targetDir));
        hostedGitInfo && _hostedGitInfoToFields(pkg, {
            hostedGitInfo,
            rootData,
            branch,
            targetDir,
            overwriteHostedGitInfo: options === null || options === void 0 ? void 0 : options.overwriteHostedGitInfo,
        });
    }
    return pkg;
}
exports.default = fillPkgHostedInfo;
//# sourceMappingURL=index.js.map