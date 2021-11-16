"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDepsFromYarnLock = exports.installDepsFromYarnLockCore = exports.filterDepsFromYarnLock = void 0;
const tslib_1 = require("tslib");
const find_root_1 = require("@yarn-tool/find-root");
const package_dts_1 = require("@ts-type/package-dts");
const npm_package_arg_util_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/npm-package-arg-util"));
const yarnlock_parse_1 = require("@yarn-tool/yarnlock-parse");
const groupYarnLockParsedEntries_1 = require("@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries");
const lodash_1 = require("lodash");
const path_1 = require("path");
const addDependenciesIfNotExists_1 = require("./addDependenciesIfNotExists");
const read_1 = require("@yarn-tool/yarnlock-fs/lib/read");
const core_1 = require("array-hyper-unique/core");
const sortDependencies_1 = require("./util/sortDependencies");
const fetchRemoteInfo_1 = require("./util/fetchRemoteInfo");
function filterDepsFromYarnLock(packageNames, parsedOldPackage, options) {
    let group = (0, groupYarnLockParsedEntries_1.groupYarnLockParsedEntries)(parsedOldPackage, options);
    return (0, lodash_1.pick)(group, packageNames.map((name) => (0, npm_package_arg_util_1.default)(name).name));
}
exports.filterDepsFromYarnLock = filterDepsFromYarnLock;
async function installDepsFromYarnLockCore(packageNames, parsedOldPackage, options = {}) {
    var _a, _b;
    let names = packageNames.map((name) => (0, npm_package_arg_util_1.default)(name).name);
    let listRemoteInfo = await (0, fetchRemoteInfo_1.fetchRemoteInfo)(packageNames, options);
    let filteredYarnLock = filterDepsFromYarnLock(names, parsedOldPackage, {
        ...options,
        names,
    });
    const cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    const rootData = (0, find_root_1.findRootLazy)(options);
    const pkg = (_b = options.pkg) !== null && _b !== void 0 ? _b : (0, package_dts_1.readPackageJson)((0, path_1.join)(rootData.pkg, 'package.json'));
    const added = [];
    const exists = [];
    let others = packageNames.filter((packageName) => {
        var _a, _b, _c;
        const result = (0, npm_package_arg_util_1.default)(packageName);
        const { name } = result;
        let target = listRemoteInfo[name];
        let version = (_c = (_b = (_a = filteredYarnLock[name]) === null || _a === void 0 ? void 0 : _a.find) === null || _b === void 0 ? void 0 : _b.call(_a, (value) => value[0] === target.versionQuery)) === null || _c === void 0 ? void 0 : _c[0];
        if (version === null || version === void 0 ? void 0 : version.length) {
            const semver = `^${version}`;
            let bool = (0, addDependenciesIfNotExists_1.addDependenciesIfNotExists)(pkg, name, semver, options).bool;
            if (bool === false) {
                added.push([name, semver]);
                return false;
            }
            else if (bool === null) {
                exists.push(name);
                return false;
            }
        }
        return true;
    });
    const updated = others.length !== packageNames.length;
    if (updated) {
        (0, sortDependencies_1.sortDependencies)(pkg);
    }
    const result = {
        cwd,
        rootData,
        added,
        exists,
        others,
        pkg,
        updated,
    };
    result;
    return result;
}
exports.installDepsFromYarnLockCore = installDepsFromYarnLockCore;
/**
 * 檢查並且過濾要安裝的版本是否已經存在於 yarn.lock 內
 */
async function installDepsFromYarnLock(packageNames, options = {}) {
    var _a, _b;
    packageNames = (0, core_1.array_unique_overwrite)(packageNames.filter(v => v === null || v === void 0 ? void 0 : v.length));
    if (packageNames.length) {
        (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
        const rootData = (0, find_root_1.findRootLazy)(options);
        let yarnlock_cache = (0, read_1.fsYarnLockSafe)(rootData.root);
        if ((_b = yarnlock_cache.yarnlock_old) === null || _b === void 0 ? void 0 : _b.length) {
            let parsedOldPackage = (0, yarnlock_parse_1.yarnLockParse)(yarnlock_cache.yarnlock_old);
            return installDepsFromYarnLockCore(packageNames, parsedOldPackage, options);
        }
    }
}
exports.installDepsFromYarnLock = installDepsFromYarnLock;
//# sourceMappingURL=installDepsFromYarnLock.js.map