"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChangelogByCwd = void 0;
const ws_pkg_list_1 = require("ws-pkg-list");
const find_root_1 = require("@yarn-tool/find-root");
const update_1 = __importDefault(require("./update"));
const lodash_1 = require("lodash");
function updateChangelogByCwd(cwd, options) {
    let rootData = find_root_1.findRoot({
        cwd: cwd !== null && cwd !== void 0 ? cwd : process.cwd(),
    });
    if (rootData.hasWorkspace && rootData.isWorkspace) {
        throw new Error(`disallow create changelog for workspace root`);
    }
    cwd = rootData.pkg;
    let pkg = ws_pkg_list_1.wsPkgListableFromPaths([
        rootData.pkg,
    ])[0];
    options = {
        ...options,
    };
    options = lodash_1.defaults(options !== null && options !== void 0 ? options : {}, {
        rootPath: rootData.root,
    });
    return update_1.default(pkg, options)
        .then(data => {
        return {
            ...data,
            cwd,
            rootPath: options.rootPath,
            options,
            pkg,
        };
    });
}
exports.updateChangelogByCwd = updateChangelogByCwd;
exports.default = updateChangelogByCwd;
//# sourceMappingURL=from-list.js.map