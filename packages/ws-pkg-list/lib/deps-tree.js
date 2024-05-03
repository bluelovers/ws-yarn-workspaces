"use strict";
/**
 * Created by user on 2020/6/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsPkgDepsListable = wsPkgDepsListable;
exports.wsPkgDepsListableRecord = wsPkgDepsListableRecord;
const util_1 = require("./util");
const find_root_1 = require("@yarn-tool/find-root");
const listable_1 = require("./listable");
function wsPkgDepsListable(cwd, options) {
    cwd = (0, find_root_1.findRoot)({
        cwd: cwd !== null && cwd !== void 0 ? cwd : process.cwd(),
        throwError: true,
    }).root;
    let _handler = (row, pkg) => {
        row.dependencies = pkg.dependencies;
        row.devDependencies = pkg.devDependencies;
        row.optionalDependencies = pkg.optionalDependencies;
        row.peerDependencies = pkg.peerDependencies;
        return row;
    };
    let handler = (row, pkg) => {
        return _handler((0, util_1.normalizeListableRowExtra)(row, cwd), pkg);
    };
    if (options === null || options === void 0 ? void 0 : options.handler) {
        let _handler_old = options.handler;
        let _old = handler;
        handler = (row, pkg) => {
            return _handler_old(_old(row, pkg), pkg);
        };
    }
    return (0, listable_1.wsPkgListable)(cwd, {
        ...options,
        handler,
    });
}
function wsPkgDepsListableRecord(cwd, options) {
    return (0, util_1.listableToRecord)(wsPkgDepsListable(cwd, options));
}
exports.default = wsPkgDepsListableRecord;
//# sourceMappingURL=deps-tree.js.map