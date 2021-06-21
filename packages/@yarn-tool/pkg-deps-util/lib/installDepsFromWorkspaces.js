"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDepsFromWorkspaces = void 0;
const listable_1 = require("ws-pkg-list/lib/listable");
const find_root_1 = require("@yarn-tool/find-root");
const package_dts_1 = require("@ts-type/package-dts");
const path_1 = require("path");
const npm_package_arg_util_1 = __importDefault(require("@yarn-tool/npm-package-arg-util"));
const addDependenciesIfNotExists_1 = require("./addDependenciesIfNotExists");
const sortDependencies_1 = require("./util/sortDependencies");
function installDepsFromWorkspaces(packageNames, options = {}) {
    var _a, _b;
    const cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    options = {
        ...options,
        cwd,
        throwError: true,
        skipCheckWorkspace: false,
        shouldHasWorkspaces: true,
        shouldNotWorkspacesRoot: true,
    };
    const rootData = find_root_1.findRoot(options);
    find_root_1.assertHasAndNotWorkspacesRoot(rootData);
    const pkg = (_b = options.pkg) !== null && _b !== void 0 ? _b : package_dts_1.readPackageJson(path_1.join(rootData.pkg, 'package.json'));
    const record = listable_1.wsPkgListable(rootData.root)
        .reduce((a, b) => {
        a[b.name] = b;
        return a;
    }, {});
    const added = [];
    const exists = [];
    const others = packageNames
        .filter(packageName => {
        const result = npm_package_arg_util_1.default(packageName);
        const { name } = result;
        const row = record[name];
        if (row) {
            const semver = `^${row.version}`;
            let bool = addDependenciesIfNotExists_1.addDependenciesIfNotExists(pkg, name, semver, options).bool;
            if (bool === false) {
                added.push([name, semver]);
            }
            else {
                exists.push(name);
            }
            return false;
        }
        else {
            return true;
        }
    });
    if (others.length !== packageNames.length) {
        sortDependencies_1.sortDependencies(pkg);
    }
    return {
        cwd,
        rootData,
        added,
        exists,
        others,
        pkg,
    };
}
exports.installDepsFromWorkspaces = installDepsFromWorkspaces;
//# sourceMappingURL=installDepsFromWorkspaces.js.map