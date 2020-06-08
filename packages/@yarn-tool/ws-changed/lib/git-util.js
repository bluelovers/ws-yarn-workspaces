"use strict";
/**
 * Created by user on 2020/6/9.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsGitDiffStagedDir = exports.wsGitDiffStagedFiles = exports.wsRootWithGitRoot = void 0;
const find_root_1 = require("@yarn-tool/find-root");
const diff_staged_1 = require("@git-lazy/diff-staged");
const git_root2_1 = __importDefault(require("git-root2"));
function wsRootWithGitRoot(cwd) {
    let rooData = find_root_1.findRoot({
        cwd,
    });
    let ws_root = rooData.root;
    let git_root = git_root2_1.default(cwd);
    if (!find_root_1.pathEqual(ws_root, git_root)) {
        throw new Error(`ws_root not same as git_root\nws_root: ${ws_root}\ngit_root: ${git_root}`);
    }
    return ws_root;
}
exports.wsRootWithGitRoot = wsRootWithGitRoot;
function wsGitDiffStagedFiles(cwd, options) {
    cwd = wsRootWithGitRoot(cwd);
    let list = diff_staged_1.gitDiffStaged(cwd, {
        bin: options === null || options === void 0 ? void 0 : options.gitBin,
    });
    return {
        cwd,
        list,
    };
}
exports.wsGitDiffStagedFiles = wsGitDiffStagedFiles;
function wsGitDiffStagedDir(cwd, options) {
    cwd = wsRootWithGitRoot(cwd);
    let list = diff_staged_1.gitDiffStagedDir(cwd, {
        bin: options === null || options === void 0 ? void 0 : options.gitBin,
    });
    return {
        cwd,
        list,
    };
}
exports.wsGitDiffStagedDir = wsGitDiffStagedDir;
//# sourceMappingURL=git-util.js.map