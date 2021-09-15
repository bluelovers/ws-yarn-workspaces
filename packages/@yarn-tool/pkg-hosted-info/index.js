"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillPkgHostedInfo = void 0;
const find_root_1 = require("@yarn-tool/find-root");
const upath2_1 = require("upath2");
const pkg_git_info_1 = require("@yarn-tool/pkg-git-info");
function fillPkgHostedInfo(pkg, options) {
    if (!pkg.homepage || !pkg.bugs || !pkg.repository) {
        let { targetDir, rootData, branch } = options !== null && options !== void 0 ? options : {};
        rootData !== null && rootData !== void 0 ? rootData : (rootData = (0, find_root_1.findRootLazy)({
            cwd: targetDir,
        }));
        targetDir !== null && targetDir !== void 0 ? targetDir : (targetDir = rootData.pkg);
        try {
            let info = (0, pkg_git_info_1.npmHostedGitInfo)(targetDir);
            // @ts-ignore
            pkg.homepage || (pkg.homepage = info.homepage);
            // @ts-ignore
            pkg.bugs || (pkg.bugs = {
                url: info.bugs,
            });
            // @ts-ignore
            pkg.repository || (pkg.repository = {
                "type": "git",
                url: info.repository,
            });
            if (rootData === null || rootData === void 0 ? void 0 : rootData.hasWorkspace) {
                branch !== null && branch !== void 0 ? branch : (branch = 'master');
                let u = new URL(pkg.homepage);
                u.pathname += `/tree/${branch}/` + (0, upath2_1.relative)(rootData.ws, targetDir);
                // @ts-ignore
                pkg.homepage = u.toString();
            }
        }
        catch (e) {
        }
    }
    return pkg;
}
exports.fillPkgHostedInfo = fillPkgHostedInfo;
//# sourceMappingURL=index.js.map