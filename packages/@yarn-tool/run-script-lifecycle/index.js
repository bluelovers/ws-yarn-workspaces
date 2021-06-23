"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLifecycleScript = void 0;
const tslib_1 = require("tslib");
/**
 * Created by user on 2020/4/8.
 */
const run_script_pkg_1 = (0, tslib_1.__importDefault)(require("@npmcli/run-script/lib/run-script-pkg"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const script_lifecycle_1 = require("@yarn-tool/script-lifecycle");
const util_1 = require("./lib/util");
const read_package_json_fast_1 = (0, tslib_1.__importDefault)(require("read-package-json-fast"));
async function runLifecycleScript(options) {
    const pkg_path = (0, path_1.join)(options.path, 'package.json');
    if ((0, fs_extra_1.pathExistsSync)(pkg_path)) {
        return (0, read_package_json_fast_1.default)(pkg_path)
            .then(async (pkg) => {
            var _a, _b;
            let lifecycle = (0, script_lifecycle_1.getLifecycle)(options.event);
            let tmpOptions = (0, util_1._options)({
                ...options,
                args: [],
                event: void 0,
                pkg,
            });
            const resultList = [];
            if ((_a = lifecycle.before) === null || _a === void 0 ? void 0 : _a.length) {
                const results = await (0, util_1.runLifecycleScriptList)({
                    eventList: lifecycle.before,
                    tmpOptions,
                    pkg,
                });
                //					results.forEach((result) => {
                //						stdoutAll.push(result.stdout)
                //					})
                resultList.push(...results);
            }
            const result = await (0, util_1.runLifecycleScriptCore)({
                ...options,
                pkg,
            }, run_script_pkg_1.default);
            resultList.push(result);
            if ((_b = lifecycle.after) === null || _b === void 0 ? void 0 : _b.length) {
                const results = await (0, util_1.runLifecycleScriptList)({
                    eventList: lifecycle.after,
                    tmpOptions,
                    pkg,
                });
                //					results.forEach((result) => {
                //						stdoutAll.push(result.stdout)
                //					})
                resultList.push(...results);
            }
            return resultList;
        });
    }
    return (0, util_1.runLifecycleScriptCore)(options)
        .then(result => [result]);
}
exports.runLifecycleScript = runLifecycleScript;
exports.default = runLifecycleScript;
//# sourceMappingURL=index.js.map