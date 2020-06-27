"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsGitChanged = exports.wsGitChangedPrefix = void 0;
const listable_1 = require("ws-pkg-list/lib/listable");
const git_util_1 = require("./git-util");
const workspaces_config_1 = __importDefault(require("workspaces-config"));
const glob_regex_1 = __importDefault(require("glob-regex"));
const core_1 = require("array-hyper-unique/core");
const util_1 = require("ws-pkg-list/lib/util");
function wsGitChangedPrefix(cwd, options) {
    let data = git_util_1.wsGitDiffStagedDir(cwd !== null && cwd !== void 0 ? cwd : process.cwd(), options);
    let config = workspaces_config_1.default(data.cwd);
    let source = config.packages.map(p => {
        let re = glob_regex_1.default(p);
        let source = re.source.replace(/\$$/, '');
        return source;
    }).join('|');
    let re = new RegExp(`(${source})`, 'i');
    let list = data.list
        .map(p => {
        var _a;
        return (_a = re.exec(p)) === null || _a === void 0 ? void 0 : _a[0];
    })
        .filter(r => r === null || r === void 0 ? void 0 : r.length);
    core_1.array_unique_overwrite(list);
    return {
        cwd: data.cwd,
        list,
    };
}
exports.wsGitChangedPrefix = wsGitChangedPrefix;
function wsGitChanged(cwd, options) {
    let data = wsGitChangedPrefix(cwd, options);
    let list = listable_1.wsPkgListableFromPaths(data.list, data.cwd);
    list = util_1.normalizeListableExtra(list, data.cwd);
    return {
        cwd: data.cwd,
        list,
    };
}
exports.wsGitChanged = wsGitChanged;
exports.default = wsGitChanged;
//# sourceMappingURL=git-changed.js.map