"use strict";
/**
 * Created by user on 2019/6/4.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostedGitInfo = getHostedGitInfo;
exports.npmHostedGitInfoLazy = npmHostedGitInfoLazy;
exports.npmHostedGitInfo = npmHostedGitInfo;
exports.npmHostedGitInfoCore = npmHostedGitInfoCore;
const tslib_1 = require("tslib");
const hosted_git_info_1 = tslib_1.__importDefault(require("hosted-git-info"));
const info_1 = require("@git-lazy/info");
function getHostedGitInfo(o) {
    return hosted_git_info_1.default.fromUrl((0, info_1.filterRemoteUrl)(o));
}
function npmHostedGitInfoLazy(cwd) {
    try {
        return npmHostedGitInfo(cwd);
    }
    catch (e) {
    }
}
function npmHostedGitInfo(cwd) {
    let file = (0, info_1.findConfigPathLocal)(cwd);
    if (file != null) {
        let o = (0, info_1.parseConfig)(file);
        let info = getHostedGitInfo(o);
        return npmHostedGitInfoCore(info);
    }
}
function npmHostedGitInfoCore(info) {
    return {
        homepage: info.docs({
            noCommittish: true,
        }),
        bugs: info.bugs({
            noCommittish: true,
        }),
        repository: info.https({
            noCommittish: true,
        }),
        _: info,
    };
}
exports.default = npmHostedGitInfo;
//# sourceMappingURL=index.js.map