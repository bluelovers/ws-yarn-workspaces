"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResolutionsUpdate = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const util_1 = require("../util");
const semver_1 = __importDefault(require("semver"));
const parse_1 = require("@yarn-tool/yarnlock/lib/parse");
const core_1 = require("@yarn-tool/yarnlock/lib/core");
const queryRemoteVersions_1 = require("../remote/queryRemoteVersions");
function checkResolutionsUpdate(resolutions, yarnlock_old_obj, options) {
    return bluebird_1.default.resolve()
        .then(async function () {
        if (typeof yarnlock_old_obj === 'string') {
            yarnlock_old_obj = parse_1.parse(yarnlock_old_obj);
        }
        let result = core_1.filterResolutions({
            resolutions,
        }, yarnlock_old_obj);
        let deps = await queryRemoteVersions_1.queryRemoteVersions(resolutions, options);
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
//# sourceMappingURL=checkResolutionsUpdate.js.map