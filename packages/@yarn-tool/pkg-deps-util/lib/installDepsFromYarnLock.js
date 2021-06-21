"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDepsFromYarnLock = exports.installDepsFromYarnLockCore = exports.filterDepsFromYarnLock = exports.fetchRemoteInfo = void 0;
const find_root_1 = require("@yarn-tool/find-root");
const package_dts_1 = require("@ts-type/package-dts");
const bluebird_1 = __importDefault(require("bluebird"));
const queryVersion_1 = require("@yarn-tool/pkg-version-query/lib/queryVersion");
const npm_package_arg_util_1 = __importDefault(require("@yarn-tool/npm-package-arg-util"));
const parseArgvPkgName_1 = require("@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName");
const groupYarnLockParsedEntries_1 = require("@yarn-tool/yarnlock-util/lib/util/groupYarnLockParsedEntries");
const lodash_1 = require("lodash");
const path_1 = require("path");
const addDependenciesIfNotExists_1 = require("./addDependenciesIfNotExists");
const read_1 = require("@yarn-tool/yarnlock-fs/lib/read");
const yarnlock_parse_1 = require("@yarn-tool/yarnlock-parse");
const core_1 = __importDefault(require("sort-object-keys2/core"));
function fetchRemoteInfo(packageNames, options = {}) {
    return bluebird_1.default.resolve(packageNames)
        .reduce(async (data, input) => {
        const result = parseArgvPkgName_1.parsePackageName(input);
        const versionQuery = await queryVersion_1.queryVersionWithCache(result.name, result.semver, options.queryOptions);
        // @ts-ignore
        data[result.name] = {
            ...result,
            versionQuery,
        };
        return data;
    }, {});
}
exports.fetchRemoteInfo = fetchRemoteInfo;
function filterDepsFromYarnLock(packageNames, parsedOldPackage, options) {
    let group = groupYarnLockParsedEntries_1.groupYarnLockParsedEntries(parsedOldPackage, options);
    console.dir(group);
    return lodash_1.pick(group, packageNames.map((name) => npm_package_arg_util_1.default(name).name));
}
exports.filterDepsFromYarnLock = filterDepsFromYarnLock;
async function installDepsFromYarnLockCore(packageNames, parsedOldPackage, options = {}) {
    var _a, _b, _c, _d, _e, _f;
    let names = packageNames.map((name) => npm_package_arg_util_1.default(name).name);
    let listRemoteInfo = await fetchRemoteInfo(packageNames, options);
    let filteredYarnLock = filterDepsFromYarnLock(names, parsedOldPackage, {
        ...options,
        names,
    });
    const cwd = (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    const rootData = find_root_1.findRootLazy(options);
    const pkg = (_b = options.pkg) !== null && _b !== void 0 ? _b : package_dts_1.readPackageJson(path_1.join(rootData.pkg, 'package.json'));
    const added = [];
    let others = packageNames.filter((packageName) => {
        var _a, _b, _c;
        const result = npm_package_arg_util_1.default(packageName);
        const { name } = result;
        let target = listRemoteInfo[name];
        let version = (_c = (_b = (_a = filteredYarnLock[name]) === null || _a === void 0 ? void 0 : _a.find) === null || _b === void 0 ? void 0 : _b.call(_a, (value) => value[0] === target.versionQuery)) === null || _c === void 0 ? void 0 : _c[0];
        if (version === null || version === void 0 ? void 0 : version.length) {
            const semver = `^${version}`;
            let bool = addDependenciesIfNotExists_1.addDependenciesIfNotExists(pkg, name, semver, options).bool;
            if (bool === false) {
                added.push([name, semver]);
                return false;
            }
            else if (bool === null) {
                return false;
            }
        }
        return true;
    });
    if (others.length !== packageNames.length) {
        let opts = {
            useSource: true,
        };
        core_1.default((_c = pkg.dependencies) !== null && _c !== void 0 ? _c : {}, opts);
        core_1.default((_d = pkg.devDependencies) !== null && _d !== void 0 ? _d : {}, opts);
        core_1.default((_e = pkg.peerDependencies) !== null && _e !== void 0 ? _e : {}, opts);
        core_1.default((_f = pkg.optionalDependencies) !== null && _f !== void 0 ? _f : {}, opts);
    }
    return {
        cwd,
        rootData,
        added,
        others,
        pkg,
    };
}
exports.installDepsFromYarnLockCore = installDepsFromYarnLockCore;
/**
 * 檢查並且過濾要安裝的版本是否已經存在於 yarn.lock 內
 */
async function installDepsFromYarnLock(packageNames, options = {}) {
    var _a, _b;
    if (packageNames.length) {
        (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
        const rootData = find_root_1.findRootLazy(options);
        let yarnlock_cache = read_1.fsYarnLockSafe(rootData.root);
        if ((_b = yarnlock_cache.yarnlock_old) === null || _b === void 0 ? void 0 : _b.length) {
            let parsedOldPackage = yarnlock_parse_1.yarnLockParse(yarnlock_cache.yarnlock_old);
            return installDepsFromYarnLockCore(packageNames, parsedOldPackage, options);
        }
    }
}
exports.installDepsFromYarnLock = installDepsFromYarnLock;
//# sourceMappingURL=installDepsFromYarnLock.js.map