"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryRemoteVersions = void 0;
const tslib_1 = require("tslib");
const types_1 = require("../types");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const options_1 = require("../options");
const store_1 = require("../store");
const util_1 = require("../util");
const semver_1 = tslib_1.__importDefault(require("semver"));
const remote_1 = require("../remote");
const versionmanager_1 = require("npm-check-updates/lib/versionmanager");
function queryRemoteVersions(packageMap, options = {}) {
    return bluebird_1.default.resolve()
        .then(async function () {
        options = (0, options_1.npmCheckUpdatesOptions)(options);
        //console.dir(options);
        options.loglevel = 'silent';
        let versionTarget = options.versionTarget = (0, remote_1.getVersionTarget)(options) || types_1.EnumVersionValue.latest;
        if (Array.isArray(packageMap)) {
            packageMap = packageMap.reduce(function (a, b) {
                a[b] = versionTarget;
                return a;
            }, {});
        }
        let packageMapArray = (0, remote_1.packageMapToKeyObject)(packageMap, versionTarget);
        let packageMapArrayFilted = await bluebird_1.default.resolve(packageMapArray)
            .filter(async (d) => {
            let bool = !(0, store_1.hasQueryedVersionCache)(d);
            if (bool && (0, util_1.isBadVersion)(d.version_old)) {
                if (versionTarget === types_1.EnumVersionValue.minor) {
                    let version_new = await (0, remote_1.queryPackageManagersNpm)(d.name);
                    d.version_old = version_new.split('.')[0] + '.0.0';
                    (0, store_1.setVersionCacheMap)({
                        ...d,
                        version_new,
                    });
                    bool = false;
                }
            }
            return bool;
        });
        let packageMap2 = (0, util_1.keyObjectToPackageMap)(packageMapArrayFilted);
        return bluebird_1.default
            .resolve((0, versionmanager_1.queryVersions)(packageMap2, options))
            .tap(ret => {
            return bluebird_1.default.resolve(Object.entries(packageMap2))
                .each(async ([name, version_old]) => {
                let version_new = ret[name];
                if (version_old.includes('~')) {
                    if (!options.noSafe || version_new == null) {
                        version_new = await (0, remote_1.fetchVersion)(name, {
                            filter(version) {
                                return semver_1.default.satisfies(version, version_old);
                            },
                        }, options)
                            .then(ret => ret.pop());
                    }
                }
                if (version_new == null && (0, util_1.isBadVersion)(version_old)) {
                    version_new = await (0, remote_1.queryPackageManagersNpm)(name, null, versionTarget);
                }
                if (version_new == null) {
                    version_new = await (0, remote_1.queryPackageManagersNpm)(name, version_old, versionTarget);
                }
                (0, store_1.setVersionCacheMap)({
                    name,
                    versionTarget,
                    version_old,
                    version_new,
                });
            });
        })
            .then(() => {
            return packageMapArray
                .map(data => store_1.versionCacheMap.get((0, store_1.strVersionCache)(data)));
        });
    });
}
exports.queryRemoteVersions = queryRemoteVersions;
//# sourceMappingURL=queryRemoteVersions.js.map