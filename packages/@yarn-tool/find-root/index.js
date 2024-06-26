"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathEqual = exports.pathNormalize = void 0;
exports.findRootLazy = findRootLazy;
exports.findRoot = findRoot;
exports.newFakeRootData = newFakeRootData;
exports.assertHasWorkspaces = assertHasWorkspaces;
exports.assertNotWorkspacesRoot = assertNotWorkspacesRoot;
exports.assertHasAndNotWorkspacesRoot = assertHasAndNotWorkspacesRoot;
exports.listMatchedPatternByPath = listMatchedPatternByPath;
const tslib_1 = require("tslib");
const upath2_1 = require("upath2");
Object.defineProperty(exports, "pathNormalize", { enumerable: true, get: function () { return upath2_1.normalize; } });
const core_1 = require("find-yarn-workspace-root2/core");
const err_code_1 = tslib_1.__importDefault(require("err-code"));
const path_is_same_1 = require("path-is-same");
Object.defineProperty(exports, "pathEqual", { enumerable: true, get: function () { return path_is_same_1.pathIsSame; } });
const pkg_dir_1 = require("pkg-dir");
function findRootLazy(options, _throwError) {
    var _a;
    options !== null && options !== void 0 ? options : (options = {});
    (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    return findRoot(options, _throwError);
}
function findRoot(options, _throwError) {
    var _a;
    if (!((_a = options.cwd) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new RangeError(`options.cwd is '${options.cwd}'`);
    }
    const cwd = (0, upath2_1.normalize)(options.cwd);
    let ws;
    if (!options.skipCheckWorkspace) {
        ws = (0, core_1.findWorkspaceRoot)(cwd);
    }
    else if (options.shouldHasWorkspaces) {
        throw (0, err_code_1.default)(new RangeError(`shouldHasWorkspaces and skipCheckWorkspace should not enable at same time`), {
            options,
        });
    }
    let pkg = (0, pkg_dir_1.sync)(cwd);
    const { throwError = _throwError } = options;
    if (pkg == null && (throwError || options.shouldHasWorkspaces)) {
        const err = (0, err_code_1.default)(new RangeError(`can't found package root from target directory '${cwd}'`), {
            options,
        });
        throw err;
    }
    if (typeof ws === 'string') {
        ws = (0, upath2_1.normalize)(ws);
    }
    if (typeof pkg === 'string') {
        pkg = (0, upath2_1.normalize)(pkg);
    }
    pkg !== null && pkg !== void 0 ? pkg : (pkg = void 0);
    ws !== null && ws !== void 0 ? ws : (ws = void 0);
    const hasWorkspace = (ws === null || ws === void 0 ? void 0 : ws.length) > 0;
    const isWorkspace = hasWorkspace && (0, path_is_same_1.pathIsSame)(ws, pkg);
    const root = hasWorkspace ? ws : pkg;
    const isRoot = (0, path_is_same_1.pathIsSame)(root, pkg);
    if (!(root === null || root === void 0 ? void 0 : root.length)) {
        return null;
    }
    const rootData = {
        cwd,
        pkg,
        ws,
        hasWorkspace,
        isWorkspace,
        root,
        isRoot,
    };
    if (options.shouldHasWorkspaces) {
        assertHasWorkspaces(rootData);
    }
    if (options.shouldNotWorkspacesRoot) {
        assertNotWorkspacesRoot(rootData);
    }
    return rootData;
}
function newFakeRootData(rootData, input) {
    var _a, _b;
    const isRoot = (_a = input.isRoot) !== null && _a !== void 0 ? _a : (0, path_is_same_1.pathIsSame)(input.pkg, rootData.root);
    const isWorkspace = (_b = input.isWorkspace) !== null && _b !== void 0 ? _b : (0, path_is_same_1.pathIsSame)(input.pkg, rootData.ws);
    const _rootDataFake = {
        ...rootData,
        ...input,
        isRoot,
        isWorkspace,
    };
    return _rootDataFake;
}
function assertHasWorkspaces(rootData) {
    var _a;
    if (!((_a = rootData.pkg) === null || _a === void 0 ? void 0 : _a.length) || rootData.hasWorkspace !== true) {
        throw (0, err_code_1.default)(new RangeError(`cwd should inside of workspaces root`), {
            rootData,
        });
    }
}
function assertNotWorkspacesRoot(rootData) {
    if (rootData.hasWorkspace === true) {
        if (rootData.isWorkspace === true) {
            throw (0, err_code_1.default)(new RangeError(`cwd should not as workspaces root`), {
                rootData,
            });
        }
    }
}
function assertHasAndNotWorkspacesRoot(rootData) {
    assertHasWorkspaces(rootData);
    assertNotWorkspacesRoot(rootData);
}
function listMatchedPatternByPath(ws, pkg) {
    const manifest = (0, core_1.readPackageJSON)(ws);
    if (!manifest || !manifest.workspaces) {
        throw new RangeError(`not a package.json of yarn workspaces`);
    }
    const workspaces = (0, core_1.extractWorkspaces)(manifest);
    const relativePath = (0, upath2_1.relative)(ws, pkg);
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
        if ((0, core_1.isMatchWorkspaces)(relativePath, [
            b,
            ...ignores,
        ])) {
            a.push(b);
        }
        return a;
    }, []);
}
exports.default = findRoot;
//# sourceMappingURL=index.js.map