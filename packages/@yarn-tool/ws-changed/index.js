"use strict";
/**
 * Created by user on 2020/6/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsChanged = exports.wsGitChanged = exports.lernaChanged = void 0;
const git_changed_1 = require("./lib/git-changed");
Object.defineProperty(exports, "wsGitChanged", { enumerable: true, get: function () { return git_changed_1.wsGitChanged; } });
const lerna_changed_1 = require("./lib/lerna-changed");
Object.defineProperty(exports, "lernaChanged", { enumerable: true, get: function () { return lerna_changed_1.lernaChanged; } });
function wsChanged(cwd, options) {
    let data1 = (0, lerna_changed_1.lernaChanged)(cwd !== null && cwd !== void 0 ? cwd : process.cwd(), options);
    let data2 = (0, git_changed_1.wsGitChanged)(data1.cwd, options);
    cwd = data1.cwd;
    return {
        cwd,
        changed: data1.list,
        staged: data2.list,
    };
}
exports.wsChanged = wsChanged;
exports.default = wsChanged;
//# sourceMappingURL=index.js.map