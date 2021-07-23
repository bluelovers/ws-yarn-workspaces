"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMatchedPatternByPath = exports.pathEqual = exports.pathNormalize = exports.assertHasAndNotWorkspacesRoot = exports.assertNotWorkspacesRoot = exports.assertHasWorkspaces = exports.findRoot = exports.findRootLazy = void 0;
const tslib_1 = require("tslib");
const upath2_1 = require("upath2");
Object.defineProperty(exports, "pathNormalize", { enumerable: true, get: function () { return upath2_1.normalize; } });
const core_1 = require("find-yarn-workspace-root2/core");
const err_code_1 = (0, tslib_1.__importDefault)(require("err-code"));
const pkg_dir_1 = require("pkg-dir");
function findRootLazy(options, _throwError) {
    var _a;
    options !== null && options !== void 0 ? options : (options = {});
    (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    return findRoot(options, _throwError);
}
exports.findRootLazy = findRootLazy;
function findRoot(options, _throwError) {
    var _a;
    if (!((_a = options.cwd) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new RangeError(`options.cwd is '${options.cwd}'`);
    }
    let ws;
    if (!options.skipCheckWorkspace) {
        ws = (0, core_1.findWorkspaceRoot)(options.cwd);
    }
    else if (options.shouldHasWorkspaces) {
        throw (0, err_code_1.default)(new RangeError(`shouldHasWorkspaces and skipCheckWorkspace should not enable at same time`), {
            options,
        });
    }
    let pkg = (0, pkg_dir_1.sync)(options.cwd);
    const { throwError = _throwError } = options;
    if (pkg == null && (throwError || options.shouldHasWorkspaces)) {
        const err = (0, err_code_1.default)(new RangeError(`can't found package root from target directory '${options.cwd}'`), {
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
    const hasWorkspace = (ws === null || ws === void 0 ? void 0 : ws.length) > 0;
    const isWorkspace = hasWorkspace && pathEqual(ws, pkg);
    const root = hasWorkspace ? ws : pkg;
    const isRoot = pathEqual(root, pkg);
    const rootData = {
        pkg,
        ws,
        hasWorkspace,
        isWorkspace,
        root,
        isRoot
    };
    if (options.shouldHasWorkspaces) {
        assertHasWorkspaces(rootData);
    }
    if (options.shouldNotWorkspacesRoot) {
        assertNotWorkspacesRoot(rootData);
    }
    return rootData;
}
exports.findRoot = findRoot;
function assertHasWorkspaces(rootData) {
    var _a;
    if (!((_a = rootData.pkg) === null || _a === void 0 ? void 0 : _a.length) || rootData.hasWorkspace !== true) {
        throw (0, err_code_1.default)(new RangeError(`cwd should inside of workspaces root`), {
            rootData,
        });
    }
}
exports.assertHasWorkspaces = assertHasWorkspaces;
function assertNotWorkspacesRoot(rootData) {
    if (rootData.hasWorkspace === true) {
        if (rootData.isWorkspace === true) {
            throw (0, err_code_1.default)(new RangeError(`cwd should not as workspaces root`), {
                rootData,
            });
        }
    }
}
exports.assertNotWorkspacesRoot = assertNotWorkspacesRoot;
function assertHasAndNotWorkspacesRoot(rootData) {
    assertHasWorkspaces(rootData);
    assertNotWorkspacesRoot(rootData);
}
exports.assertHasAndNotWorkspacesRoot = assertHasAndNotWorkspacesRoot;
function pathEqual(a, b) {
    if (!(a === null || a === void 0 ? void 0 : a.length) || !(b === null || b === void 0 ? void 0 : b.length))
        return null;
    return (0, upath2_1.normalize)(a) === (0, upath2_1.normalize)(b);
}
exports.pathEqual = pathEqual;
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
exports.listMatchedPatternByPath = listMatchedPatternByPath;
exports.default = findRoot;
//# sourceMappingURL=index.js.map