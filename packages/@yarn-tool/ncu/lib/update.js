"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmCheckUpdates = exports.checkResolutionsUpdate = void 0;
/**
 * Created by user on 2020/6/12.
 */
const npm_check_updates_1 = require("npm-check-updates");
const yarnlock_1 = require("@yarn-tool/yarnlock");
const bluebird_1 = __importDefault(require("bluebird"));
const util_1 = require("./util");
const semver_1 = __importDefault(require("semver"));
const remote_1 = require("./remote");
const options_1 = require("./options");
const table_1 = require("@yarn-tool/table");
const npm_package_arg_1 = __importDefault(require("npm-package-arg"));
const queryVersion_1 = require("@yarn-tool/pkg-version-query/lib/queryVersion");
const pkg_version_query_1 = require("@yarn-tool/pkg-version-query");
const parseSimpleSemVer_1 = require("@lazy-node/semver-simple-parse/lib/parseSimpleSemVer");
const mergeSimpleSemVer_1 = require("@lazy-node/semver-simple-parse/lib/mergeSimpleSemVer");
const stringifySimpleSemVer_1 = require("@lazy-node/semver-simple-parse/lib/stringifySimpleSemVer");
function checkResolutionsUpdate(resolutions, yarnlock_old_obj, options) {
    return bluebird_1.default.resolve()
        .then(async function () {
        if (typeof yarnlock_old_obj === 'string') {
            yarnlock_old_obj = yarnlock_1.parse(yarnlock_old_obj);
        }
        let result = yarnlock_1.filterResolutions({
            resolutions,
        }, yarnlock_old_obj);
        let deps = await remote_1.queryRemoteVersions(resolutions, options);
        //console.dir(deps);
        let deps2 = util_1.keyObjectToPackageMap(deps, true);
        let deps3 = Object.values(deps)
            .reduce(function (a, b) {
            a[b.name] = b;
            return a;
        }, {});
        let yarnlock_new_obj = {
            ...yarnlock_old_obj,
        };
        let update_list = [];
        let yarnlock_changed = false;
        Object.entries(result.max)
            .forEach(function ([name, data]) {
            let _key2 = name + '@' + deps3[name].version_old;
            /**
             * 檢查 版本範圍是否符合 與 版本是否不相同
             */
            //					console.dir({
            //						data,
            //						deps: deps2[name],
            //					});
            if (data.value.version != null && deps2[name] != null && semver_1.default.lt(data.value.version, deps2[name]) && yarnlock_new_obj[_key2] && yarnlock_new_obj[_key2].version != data.value.version) {
                Object.keys(result.deps[name])
                    .forEach(version => {
                    let key = name + '@' + version;
                    delete yarnlock_new_obj[key];
                });
                yarnlock_changed = true;
                update_list.push(name);
            }
            else {
                if (result.installed[name].length > 1) {
                    Object.keys(result.deps[name])
                        .forEach(version => {
                        let key = name + '@' + version;
                        yarnlock_new_obj[key] = data.value;
                    });
                    yarnlock_changed = true;
                }
            }
        });
        return {
            yarnlock_old_obj,
            yarnlock_new_obj,
            update_list,
            yarnlock_changed,
            deps,
            deps2,
            deps3,
        };
    });
}
exports.checkResolutionsUpdate = checkResolutionsUpdate;
async function npmCheckUpdates(cache, ncuOptions) {
    //ncuOptions.silent = false;
    //ncuOptions.json = false;
    //ncuOptions.cli = true;
    //ncuOptions.args = [];
    //ncuOptions.loglevel = 'verbose';
    ncuOptions = options_1.npmCheckUpdatesOptions(ncuOptions);
    ncuOptions.cwd = cache.cwd;
    ncuOptions.json_new = JSON.parse(ncuOptions.packageData);
    ncuOptions.list_updated = await npm_check_updates_1.run(ncuOptions);
    let json_changed = false;
    const current = {};
    const list_updated = {};
    await bluebird_1.default
        .resolve([
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'optionalDependencies',
    ])
        .each(async (key) => {
        var _a;
        const deps = (_a = ncuOptions.json_new[key]) !== null && _a !== void 0 ? _a : {};
        await bluebird_1.default
            .resolve(Object.keys(deps))
            .each(async (name) => {
            var _a;
            const version_new = ncuOptions.list_updated[name];
            const version_old = deps[name];
            if (version_new === null || version_new === void 0 ? void 0 : version_new.length) {
                if (version_old !== version_new && util_1.allowUpdateVersion(version_old)) {
                    list_updated[name] = version_new;
                    current[name] = version_old;
                    deps[name] = version_new;
                    json_changed = true;
                }
            }
            else if (!/[\s|&]/.test(version_old)) {
                let key = `${name}@${version_old}`;
                let check = npm_package_arg_1.default(key);
                let prefix = (_a = /^([\^~\s]+)/.exec(version_old)) === null || _a === void 0 ? void 0 : _a[1];
                if ((prefix === null || prefix === void 0 ? void 0 : prefix.length) && check.type === 'range') {
                    let version_new = await queryVersion_1.queryVersionWithCache(name, version_old)
                        .then(v => prefix + v)
                        .catch(e => null);
                    if ((version_new === null || version_new === void 0 ? void 0 : version_new.length) && version_new !== version_old) {
                        try {
                            let { target } = mergeSimpleSemVer_1.mergeSimpleSemVer(parseSimpleSemVer_1.parseSimpleSemVer(version_old), parseSimpleSemVer_1.parseSimpleSemVer(version_new));
                            let version = stringifySimpleSemVer_1.stringifySemverFull(target);
                            if ((version === null || version === void 0 ? void 0 : version.length) > 0) {
                                list_updated[name] = version;
                                current[name] = version_old;
                                deps[name] = version;
                                json_changed = true;
                            }
                        }
                        catch (err) { }
                    }
                }
            }
        });
    });
    await pkg_version_query_1.getCache().fsDump();
    ncuOptions.json_changed = json_changed;
    ncuOptions.list_updated = list_updated;
    ncuOptions.current = current;
    const table = table_1.toDependencyTable({
        from: ncuOptions.current,
        to: ncuOptions.list_updated,
    }).toString();
    table && console.log(`\n${table}\n`);
    return ncuOptions;
}
exports.npmCheckUpdates = npmCheckUpdates;
//# sourceMappingURL=update.js.map