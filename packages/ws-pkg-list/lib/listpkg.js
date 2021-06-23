"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspacesPackagesList = void 0;
const tslib_1 = require("tslib");
const core_1 = (0, tslib_1.__importDefault)(require("find-yarn-workspace-root2/core"));
const workspaces_config_1 = require("workspaces-config");
const upath2_1 = require("upath2");
const fast_glob_1 = (0, tslib_1.__importDefault)(require("@bluelovers/fast-glob"));
function workspacesPackagesList(cwd, absolute) {
    if (typeof cwd === 'boolean') {
        // @ts-ignore
        [cwd, absolute] = [null, cwd];
    }
    cwd = cwd || process.cwd();
    let not_absolute = absolute === false;
    let root = (0, core_1.default)(cwd);
    let ps = (0, workspaces_config_1.getConfig)(root).packages.map(function (v) {
        return (0, upath2_1.join)(v, 'package.json');
    });
    return fast_glob_1.default.sync(ps, {
        cwd: root,
        absolute: true,
    }).map(function (v) {
        let p = (0, upath2_1.dirname)(v);
        if (not_absolute) {
            p = (0, upath2_1.relative)(cwd, p);
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