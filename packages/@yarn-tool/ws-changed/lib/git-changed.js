"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsGitChanged = exports.wsGitChangedPrefix = void 0;
const tslib_1 = require("tslib");
const listable_1 = require("ws-pkg-list/lib/listable");
const git_util_1 = require("./git-util");
const workspaces_config_1 = (0, tslib_1.__importDefault)(require("workspaces-config"));
const glob_regex_1 = (0, tslib_1.__importDefault)(require("glob-regex"));
const core_1 = require("array-hyper-unique/core");
const util_1 = require("ws-pkg-list/lib/util");
function wsGitChangedPrefix(cwd, options) {
    let data = (0, git_util_1.wsGitDiffStagedDir)(cwd !== null && cwd !== void 0 ? cwd : process.cwd(), options);
    let config = (0, workspaces_config_1.default)(data.cwd);
    let source = config.packages.map(p => {
        let re = (0, glob_regex_1.default)(p);
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
    (0, core_1.array_unique_overwrite)(list);
    return {
        cwd: data.cwd,
        list,
    };
}
exports.wsGitChangedPrefix = wsGitChangedPrefix;
function wsGitChanged(cwd, options) {
    let data = wsGitChangedPrefix(cwd, options);
    let list = (0, listable_1.wsPkgListableFromPaths)(data.list, data.cwd);
    list = (0, util_1.normalizeListableExtra)(list, data.cwd);
    return {
        cwd: data.cwd,
        list,
    };
}
exports.wsGitChanged = wsGitChanged;
exports.default = wsGitChanged;
//# sourceMappingURL=git-changed.js.map