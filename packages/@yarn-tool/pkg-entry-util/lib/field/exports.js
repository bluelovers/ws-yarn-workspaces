"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pkgExportsVerify = exports._isPackageExportsEntry = exports.pkgExportsAddPJsonEntry = exports._pkgExportsAddPJsonEntryCore = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const find_root_1 = require("@yarn-tool/find-root");
function _pkgExportsAddPJsonEntryCore(pkgExports) {
    var _a;
    if (typeof pkgExports === 'object') {
        (_a = pkgExports['./package.json']) !== null && _a !== void 0 ? _a : (pkgExports['./package.json'] = './package.json');
    }
    return pkgExports;
}
exports._pkgExportsAddPJsonEntryCore = _pkgExportsAddPJsonEntryCore;
function pkgExportsAddPJsonEntry(pkg) {
    _pkgExportsAddPJsonEntryCore(pkg.exports);
    return pkg;
}
exports.pkgExportsAddPJsonEntry = pkgExportsAddPJsonEntry;
function _isPackageExportsEntry(entry, value) {
    return entry.startsWith('./') && !!(value !== null && value !== void 0 ? value : false);
}
exports._isPackageExportsEntry = _isPackageExportsEntry;
function pkgExportsVerify(pkg, options) {
    if (typeof pkg.exports === 'object') {
        const rootData = (0, find_root_1.findRootLazy)({
            cwd: options === null || options === void 0 ? void 0 : options.cwd,
        });
        if (!rootData.isWorkspace && rootData.pkg) {
            const list = [];
            Object.entries(pkg.exports)
                .forEach(([entry, value]) => {
                if (_isPackageExportsEntry(entry, value)) {
                    [typeof value === 'string' ? value : Object.values(value)]
                        .flat()
                        .forEach(file => {
                        const bool = (0, fs_extra_1.pathExistsSync)((0, path_1.resolve)(rootData.pkg, file));
                        if (!bool) {
                            list.push(`path of '${entry}' does not exist: '${file}'`);
                        }
                    });
                }
            });
            if (list.length > 0) {
                let err = new Error(`Invalid package exports: ${rootData.pkg}\n${list.slice().map(v => ` - ${v}`).join('\n')}`);
                // @ts-ignore
                err.list = list;
                // @ts-ignore
                err.rootData = rootData;
                // @ts-ignore
                err.pkgExports = pkg.exports;
                throw err;
            }
        }
    }
    return null;
}
exports.pkgExportsVerify = pkgExportsVerify;
//# sourceMappingURL=exports.js.map