"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsPkgListableFromReaded = wsPkgListableFromReaded;
exports.wsPkgListableFromPaths = wsPkgListableFromPaths;
exports.wsPkgListable = wsPkgListable;
/**
 * Created by user on 2020/6/5.
 */
const readpkg_1 = require("./readpkg");
const listpkg_1 = require("./listpkg");
function wsPkgListableFromReaded(readed, options) {
    const { handler } = options !== null && options !== void 0 ? options : {};
    return Object.values(readed)
        .map((data) => {
        const { name, fullpath: location } = data;
        let { version } = data.config;
        let row = {
            name,
            version,
            private: !!data.config.private,
            location,
            manifestLocation: data.manifestLocation,
        };
        if (handler) {
            row = handler === null || handler === void 0 ? void 0 : handler(row, data.config);
            if (typeof row === 'undefined' || typeof row.name === 'undefined' || typeof row.version === 'undefined' || typeof row.private === 'undefined' || typeof row.location === 'undefined') {
                throw new TypeError(`handler return not invalid data`);
            }
        }
        return row;
    });
}
function wsPkgListableFromPaths(paths, cwd, options) {
    cwd = cwd !== null && cwd !== void 0 ? cwd : process.cwd();
    return wsPkgListableFromReaded((0, readpkg_1.readPackages)(paths, cwd), options);
}
function wsPkgListable(cwd, options) {
    cwd = cwd !== null && cwd !== void 0 ? cwd : process.cwd();
    return wsPkgListableFromPaths((0, listpkg_1.workspacesPackagesList)(cwd), cwd, options);
}
exports.default = wsPkgListable;
//# sourceMappingURL=listable.js.map