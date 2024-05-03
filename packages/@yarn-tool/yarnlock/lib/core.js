"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterResolutions = filterResolutions;
exports.removeResolutions = removeResolutions;
exports.removeResolutionsCore = removeResolutionsCore;
exports.filterDuplicateYarnLock = filterDuplicateYarnLock;
exports.exportYarnLock = exportYarnLock;
const tslib_1 = require("tslib");
const semver_1 = tslib_1.__importDefault(require("semver"));
const util_1 = require("./util");
function filterResolutions(pkg, yarnlock) {
    if (pkg.resolutions) {
        return exportYarnLock(yarnlock, (key, index, array_keys, yarnlock1) => {
            let name = (0, util_1.stripDepsName)(key)[0];
            return pkg.resolutions[name] != null;
        });
    }
    return null;
}
/**
 *
 * @example ```
 let pkg = readPackageJson('G:/Users/The Project/nodejs-yarn/ws-create-yarn-workspaces/package.json');

 let y = readYarnLockfile('G:/Users/The Project/nodejs-yarn/ws-create-yarn-workspaces/yarn.lock')

 console.dir(removeResolutions(pkg, y), {
    depth: null,
});
 ```
 */
function removeResolutions(pkg, yarnlock_old) {
    let result = filterResolutions(pkg, yarnlock_old);
    return removeResolutionsCore(result, yarnlock_old);
}
function removeResolutionsCore(result, yarnlock_old) {
    // @ts-ignore
    let yarnlock_new = result.names
        // @ts-ignore
        .reduce(function (a, b) {
        delete a[b];
        return a;
    }, {
        ...yarnlock_old,
    });
    let yarnlock_changed = !!result.names.length;
    return {
        /**
         * 執行前的 yarn.lock
         */
        yarnlock_old,
        /**
         * 執行後的 yarn.lock
         */
        yarnlock_new,
        /**
         * yarn.lock 是否有變動
         */
        yarnlock_changed,
        result,
    };
}
function filterDuplicateYarnLock(yarnlock) {
    let fy = exportYarnLock(yarnlock);
    let ks = Object.keys(fy.installed)
        .filter(function (value) {
        return fy.installed[value].length > 1;
    });
    return exportYarnLock(yarnlock, (key, index, array_keys, yarnlock1) => {
        let n = (0, util_1.stripDepsName)(key)[0];
        return ks.includes(n);
    });
}
function exportYarnLock(yarnlock, filter) {
    let ks = Object.keys(yarnlock);
    if (filter) {
        ks = ks
            .filter((value, index, array) => {
            return filter(value, index, array, yarnlock);
        });
    }
    return ks
        .reduce(function (a, k) {
        let n = (0, util_1.stripDepsName)(k);
        let name = n[0];
        let key = n[1];
        let data = yarnlock[k];
        // @ts-ignore
        (a.deps[name] = a.deps[name] || {})[key] = data;
        a.installed[name] = a.installed[n[0]] || [];
        if (!a.installed[name].includes(data.version)) {
            a.installed[name].push(data.version);
            if (a.max[name] != null) {
                if (semver_1.default.lt(a.max[name].value.version, data.version)) {
                    a.max[name] = {
                        key: k,
                        value: data,
                    };
                }
            }
            else {
                a.max[name] = {
                    key: k,
                    value: data,
                };
            }
        }
        return a;
    }, {
        names: ks,
        deps: {},
        installed: {},
        max: {},
    });
}
//# sourceMappingURL=core.js.map