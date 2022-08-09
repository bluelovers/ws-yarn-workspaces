"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResolutionsUpdate = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const util_1 = require("../util");
const semver_1 = tslib_1.__importDefault(require("semver"));
const v1_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v1");
const core_1 = require("@yarn-tool/yarnlock/lib/core");
const queryRemoteVersions_1 = require("../remote/queryRemoteVersions");
function checkResolutionsUpdate(resolutions, yarnlock_old_obj, options) {
    return bluebird_1.default.resolve()
        .then(async function () {
        /**
         * @todo support v2
         */
        if (typeof yarnlock_old_obj === 'string') {
            // @ts-ignore
            yarnlock_old_obj = (0, v1_1.parseYarnLockRawV1Root)(yarnlock_old_obj);
        }
        const result = (0, core_1.filterResolutions)({
            resolutions,
            // @ts-ignore
        }, yarnlock_old_obj);
        const deps = await (0, queryRemoteVersions_1.queryRemoteVersions)(resolutions, options);
        //console.dir(deps);
        const deps2 = (0, util_1.keyObjectToPackageMap)(deps, true);
        const deps3 = Object.values(deps)
            .reduce(function (a, b) {
            a[b.name] = b;
            return a;
        }, {});
        const yarnlock_new_obj = {
            // @ts-ignore
            ...yarnlock_old_obj,
        };
        const update_list = [];
        let yarnlock_changed = false;
        Object.entries(result.max)
            .forEach(function ([name, data]) {
            const _key2 = name + '@' + deps3[name].version_old;
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
                    const key = name + '@' + version;
                    delete yarnlock_new_obj[key];
                });
                yarnlock_changed = true;
                update_list.push(name);
            }
            else {
                if (result.installed[name].length > 1) {
                    Object.keys(result.deps[name])
                        .forEach(version => {
                        const key = name + '@' + version;
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
//# sourceMappingURL=checkResolutionsUpdate.js.map