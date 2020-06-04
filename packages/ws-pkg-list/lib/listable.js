"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsPkgListable = exports.wsPkgListableFromPaths = exports.wsPkgListableFromReaded = void 0;
/**
 * Created by user on 2020/6/5.
 */
const readpkg_1 = require("./readpkg");
const listpkg_1 = require("./listpkg");
function wsPkgListableFromReaded(readed) {
    return Object.values(readed)
        .map((data) => {
        const { name, fullpath: location } = data;
        let { version } = data.config;
        return {
            name,
            version,
            private: !!data.config.private,
            location,
        };
    });
}
exports.wsPkgListableFromReaded = wsPkgListableFromReaded;
function wsPkgListableFromPaths(paths, cwd) {
    cwd = cwd !== null && cwd !== void 0 ? cwd : process.cwd();
    return wsPkgListableFromReaded(readpkg_1.readPackages(paths, cwd));
}
exports.wsPkgListableFromPaths = wsPkgListableFromPaths;
function wsPkgListable(cwd) {
    cwd = cwd !== null && cwd !== void 0 ? cwd : process.cwd();
    return wsPkgListableFromPaths(listpkg_1.workspacesPackagesList(cwd), cwd);
}
exports.wsPkgListable = wsPkgListable;
exports.default = wsPkgListable;
//# sourceMappingURL=listable.js.map