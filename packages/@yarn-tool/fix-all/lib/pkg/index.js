"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._initPkgListableByRootData = exports._runEachPackages = exports._handler = void 0;
const ws_pkg_list_1 = require("ws-pkg-list");
function _handler(cwd, ...argv) {
    return {
        ...(0, ws_pkg_list_1.normalizeListableRowExtra)(argv[0], cwd),
        pkg: argv[1],
    };
}
exports._handler = _handler;
function _runEachPackages(list) {
    return list.slice(0, 1)
        .forEach(row => {
        console.dir(row);
    });
}
exports._runEachPackages = _runEachPackages;
function _initPkgListableByRootData(rootData) {
    let cwd = rootData.root;
    if (rootData.hasWorkspace) {
        return (0, ws_pkg_list_1.wsPkgListable)(cwd, {
            handler(...argv) {
                return _handler(cwd, ...argv);
            },
        });
    }
    return (0, ws_pkg_list_1.wsPkgListableFromPaths)([
        cwd,
    ], cwd, {
        handler(...argv) {
            return _handler(cwd, ...argv);
        },
    });
}
exports._initPkgListableByRootData = _initPkgListableByRootData;
//# sourceMappingURL=index.js.map