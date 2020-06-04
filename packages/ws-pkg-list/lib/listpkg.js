"use strict";
/**
 * Created by user on 2020/6/5.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspacesPackagesList = void 0;
const core_1 = __importDefault(require("find-yarn-workspace-root2/core"));
const workspaces_config_1 = require("workspaces-config");
const upath2_1 = require("upath2");
const fast_glob_1 = __importDefault(require("@bluelovers/fast-glob"));
function workspacesPackagesList(cwd, absolute) {
    if (typeof cwd === 'boolean') {
        // @ts-ignore
        [cwd, absolute] = [null, cwd];
    }
    cwd = cwd || process.cwd();
    let not_absolute = absolute === false;
    let root = core_1.default(cwd);
    let ps = workspaces_config_1.getConfig(root).packages.map(function (v) {
        return upath2_1.join(v, 'package.json');
    });
    return fast_glob_1.default.sync(ps, {
        cwd: root,
        absolute: true,
    }).map(function (v) {
        let p = upath2_1.dirname(v);
        if (not_absolute) {
            p = upath2_1.relative(cwd, p);
            if (p == '') {
                p = '.';
            }
        }
        return p;
    });
}
exports.workspacesPackagesList = workspacesPackagesList;
exports.default = workspacesPackagesList;
//# sourceMappingURL=listpkg.js.map