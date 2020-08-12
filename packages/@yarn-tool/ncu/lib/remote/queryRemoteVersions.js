"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryRemoteVersions = void 0;
const types_1 = require("../types");
const bluebird_1 = __importDefault(require("bluebird"));
const options_1 = require("../options");
const store_1 = require("../store");
const util_1 = require("../util");
const semver_1 = __importDefault(require("semver"));
const remote_1 = require("../remote");
const versionmanager_1 = require("npm-check-updates/lib/versionmanager");
function queryRemoteVersions(packageMap, options = {}) {
    return bluebird_1.default.resolve()
        .then(async function () {
        options = options_1.npmCheckUpdatesOptions(options);
        //console.dir(options);
        options.loglevel = 'silent';
        let versionTarget = options.versionTarget = remote_1.getVersionTarget(options) || types_1.EnumVersionValue.latest;
        if (Array.isArray(packageMap)) {
            packageMap = packageMap.reduce(function (a, b) {
                a[b] = versionTarget;
                return a;
            }, {});
        }
        let packageMapArray = remote_1.packageMapToKeyObject(packageMap, versionTarget);
        let packageMapArrayFilted = await bluebird_1.default.resolve(packageMapArray)
            .filter(async (d) => {
            let bool = !store_1.hasQueryedVersionCache(d);
            if (bool && util_1.isBadVersion(d.version_old)) {
                if (versionTarget === types_1.EnumVersionValue.minor) {
                    let version_new = await remote_1.queryPackageManagersNpm(d.name);
                    d.version_old = version_new.split('.')[0] + '.0.0';
                    store_1.setVersionCacheMap({
                        ...d,
                        version_new,
                    });
                    bool = false;
                }
            }
            return bool;
        });
        let packageMap2 = util_1.keyObjectToPackageMap(packageMapArrayFilted);
        return bluebird_1.default
            .resolve(versionmanager_1.queryVersions(packageMap2, options))
            .tap(ret => {
            return bluebird_1.default.resolve(Object.entries(packageMap2))
                .each(async ([name, version_old]) => {
                let version_new = ret[name];
                if (version_old.includes('~')) {
                    if (!options.noSafe || version_new == null) {
                        version_new = await remote_1.fetchVersion(name, {
                            filter(version) {
                                return semver_1.default.satisfies(version, version_old);
                            },
                        }, options)
                            .then(ret => ret.pop());
                    }
                }
                if (version_new == null && util_1.isBadVersion(version_old)) {
                    version_new = await remote_1.queryPackageManagersNpm(name, null, versionTarget);
                }
                if (version_new == null) {
                    version_new = await remote_1.queryPackageManagersNpm(name, version_old, versionTarget);
                }
                store_1.setVersionCacheMap({
                    name,
                    versionTarget,
                    version_old,
                    version_new,
                });
            });
        })
            .then(() => {
            return packageMapArray
                .map(data => store_1.versionCacheMap.get(store_1.strVersionCache(data)));
        });
    });
}
exports.queryRemoteVersions = queryRemoteVersions;
//# sourceMappingURL=queryRemoteVersions.js.map