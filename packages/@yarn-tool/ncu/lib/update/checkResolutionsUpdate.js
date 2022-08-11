"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResolutionsUpdate = void 0;
const bluebird_1 = require("bluebird");
const util_1 = require("../util");
const semver_1 = require("semver");
const core_1 = require("@yarn-tool/yarnlock/lib/core");
const queryRemoteVersions_1 = require("../remote/queryRemoteVersions");
const yarnlock_parse_1 = require("@yarn-tool/yarnlock-parse");
const yarnlock_parsed_to_json_1 = require("@yarn-tool/yarnlock-parsed-to-json");
function checkResolutionsUpdate(resolutions, yarnlock_old_obj, options) {
    return (0, bluebird_1.resolve)()
        .then(async function () {
        let verType;
        if (typeof yarnlock_old_obj === 'string' || Buffer.isBuffer(yarnlock_old_obj)) {
            ({ verType, parsed: yarnlock_old_obj } = (0, yarnlock_parse_1._yarnLockParseRaw)(yarnlock_old_obj));
        }
        const y_old = (0, yarnlock_parse_1._yarnLockParseCore)({
            verType,
            parsed: yarnlock_old_obj,
        });
        const result = (0, core_1.filterResolutions)({
            resolutions,
        }, y_old.data);
        const deps = await (0, queryRemoteVersions_1.queryRemoteVersions)(resolutions, options);
        //console.dir(deps);
        const deps2 = (0, util_1.keyObjectToPackageMap)(deps, true);
        const deps3 = Object.values(deps)
            .reduce(function (a, b) {
            a[b.name] = b;
            return a;
        }, {});
        const data = {
            ...y_old.data,
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
            if (data.value.version != null && deps2[name] != null && (0, semver_1.lt)(data.value.version, deps2[name]) && data[_key2] && data[_key2].version != data.value.version) {
                Object.keys(result.deps[name])
                    .forEach(version => {
                    const key = name + '@' + version;
                    delete data[key];
                });
                yarnlock_changed = true;
                update_list.push(name);
            }
            else {
                if (result.installed[name].length > 1) {
                    Object.keys(result.deps[name])
                        .forEach(version => {
                        const key = name + '@' + version;
                        data[key] = data.value;
                    });
                    yarnlock_changed = true;
                }
            }
        });
        const yarnlock_new_obj = (0, yarnlock_parsed_to_json_1.yarnLockParsedToRawJSON)({
            verType,
            meta: y_old.meta,
            data,
        });
        return {
            verType: verType,
            yarnlock_old_obj: yarnlock_old_obj,
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