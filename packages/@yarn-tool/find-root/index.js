"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMatchedPatternByPath = exports.pathEqual = exports.pathNormalize = exports.findRoot = void 0;
const upath2_1 = require("upath2");
Object.defineProperty(exports, "pathNormalize", { enumerable: true, get: function () { return upath2_1.normalize; } });
const core_1 = require("find-yarn-workspace-root2/core");
const pkg_dir_1 = require("pkg-dir");
function findRoot(options, _throwError) {
    if (!options.cwd) {
        throw new TypeError(`options.cwd is '${options.cwd}'`);
    }
    let ws;
    if (!options.skipCheckWorkspace) {
        ws = core_1.findWorkspaceRoot(options.cwd);
    }
    let pkg = pkg_dir_1.sync(options.cwd);
    let { throwError = _throwError } = options;
    if (pkg == null && throwError) {
        let err = new TypeError(`can't found package root from target directory '${options.cwd}'`);
        throw err;
    }
    let hasWorkspace = ws && ws != null;
    let isWorkspace = hasWorkspace && pathEqual(ws, pkg);
    let root = hasWorkspace ? ws : pkg;
    return {
        pkg,
        ws,
        hasWorkspace,
        isWorkspace,
        root,
    };
}
exports.findRoot = findRoot;
function pathEqual(a, b) {
    return upath2_1.normalize(a) === upath2_1.normalize(b);
}
exports.pathEqual = pathEqual;
function listMatchedPatternByPath(ws, pkg) {
    const manifest = core_1.readPackageJSON(ws);
    if (!manifest || !manifest.workspaces) {
        throw new Error(`not a package.json of yarn workspaces`);
    }
    const workspaces = core_1.extractWorkspaces(manifest);
    const relativePath = upath2_1.relative(ws, pkg);
    if (relativePath == '') {
        throw new RangeError(`pkg should not same as ws`);
    }
    const { ignores, list } = workspaces.reduce((a, b) => {
        if (b.startsWith('!')) {
            a.ignores.push(b);
        }
        else {
            a.list.push(b);
        }
        return a;
    }, {
        ignores: [],
        list: [],
    });
    return list
        .reduce(function (a, b) {
        if (core_1.isMatchWorkspaces(relativePath, [
            b,
            ...ignores,
        ])) {
            a.push(b);
        }
        return a;
    }, []);
}
exports.listMatchedPatternByPath = listMatchedPatternByPath;
exports.default = findRoot;
//# sourceMappingURL=index.js.map