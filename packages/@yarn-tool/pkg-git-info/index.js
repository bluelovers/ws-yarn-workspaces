"use strict";
/**
 * Created by user on 2019/6/4.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmHostedGitInfoCore = exports.npmHostedGitInfo = exports.getHostedGitInfo = void 0;
const hosted_git_info_1 = __importDefault(require("hosted-git-info"));
const info_1 = require("@git-lazy/info");
function getHostedGitInfo(o) {
    return hosted_git_info_1.default.fromUrl(info_1.filterRemoteUrl(o));
}
exports.getHostedGitInfo = getHostedGitInfo;
function npmHostedGitInfo(cwd) {
    let file = info_1.findConfigPathLocal(cwd);
    if (file != null) {
        let o = info_1.parseConfig(file);
        let info = getHostedGitInfo(o);
        return npmHostedGitInfoCore(info);
    }
}
exports.npmHostedGitInfo = npmHostedGitInfo;
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
exports.npmHostedGitInfoCore = npmHostedGitInfoCore;
exports.default = npmHostedGitInfo;
//# sourceMappingURL=index.js.map