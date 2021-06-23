"use strict";
/**
 * Created by user on 2020/1/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncLockfile = void 0;
const tslib_1 = require("tslib");
const ws_pkg_list_1 = require("ws-pkg-list");
const find_root_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/find-root"));
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
function syncLockfile(cwd, options = {}) {
    const { print, noThrowError } = options;
    const ws = (0, find_root_1.default)({
        cwd
    });
    if (!ws.hasWorkspace) {
        noThrowError || throwError(`target dir not a yarn workspaces, ${ws.root}`);
        return null;
    }
    const lockfile = `yarn.lock`;
    const lockfile_root = path_1.default.join(ws.root, lockfile);
    if (!fs_extra_1.default.pathExistsSync(lockfile_root)) {
        noThrowError || throwError(`yarn.lock not exists`);
        return null;
    }
    print && console.log(`workspaces:`, ws.root, '\n');
    const label = `copy done`;
    print && console.time(label);
    (0, ws_pkg_list_1.workspacesPackagesList)(ws.root, true)
        .forEach(pkg_dir => {
        print && console.log(`copy to... ${path_1.default.relative(ws.root, pkg_dir)}`);
        fs_extra_1.default.copySync(lockfile_root, path_1.default.join(pkg_dir, lockfile), {
            overwrite: true,
            preserveTimestamps: true,
            dereference: true,
        });
    });
    print && console.timeEnd(label);
    return true;
}
exports.syncLockfile = syncLockfile;
function throwError(message) {
    throw new Error(message);
}
exports.default = syncLockfile;
//# sourceMappingURL=index.js.map