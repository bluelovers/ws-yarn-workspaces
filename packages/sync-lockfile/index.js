"use strict";
/**
 * Created by user on 2020/1/8.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncLockfile = void 0;
const ws_pkg_list_1 = require("ws-pkg-list");
const find_root_1 = __importDefault(require("@yarn-tool/find-root"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function syncLockfile(cwd, options = {}) {
    const { print, noThrowError } = options;
    const ws = find_root_1.default({
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
    ws_pkg_list_1.workspacesPackagesList(ws.root, true)
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