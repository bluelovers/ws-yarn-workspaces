"use strict";
/**
 * Created by user on 2020/6/13.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsPkgDepsListableRecord = exports.wsPkgDepsListable = void 0;
const util_1 = require("./util");
const find_root_1 = require("@yarn-tool/find-root");
const listable_1 = __importDefault(require("./listable"));
function wsPkgDepsListable(cwd, options) {
    cwd = find_root_1.findRoot({
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
        return _handler(util_1.normalizeListableRowExtra(row, cwd), pkg);
    };
    if (options === null || options === void 0 ? void 0 : options.handler) {
        let _handler_old = options.handler;
        let _old = handler;
        handler = (row, pkg) => {
            return _handler_old(_old(row, pkg), pkg);
        };
    }
    return listable_1.default(cwd, {
        ...options,
        handler,
    });
}
exports.wsPkgDepsListable = wsPkgDepsListable;
function wsPkgDepsListableRecord(cwd, options) {
    return util_1.listableToRecord(wsPkgDepsListable(cwd, options));
}
exports.wsPkgDepsListableRecord = wsPkgDepsListableRecord;
exports.default = wsPkgDepsListableRecord;
//# sourceMappingURL=deps-tree.js.map