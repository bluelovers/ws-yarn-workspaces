"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._fixLernaJson = exports._fixLernaJsonCore = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const lodash_1 = require("lodash");
const __root_1 = require("@yarn-tool/static-file/__root");
const write_package_json_1 = require("@yarn-tool/write-package-json");
const array_hyper_unique_1 = require("array-hyper-unique");
function _fixLernaJsonCore(current, tpl) {
    current.command = (0, lodash_1.defaultsDeep)(current.command, tpl.command);
    current.command.publish.ignoreChanges = current.command.publish.ignoreChanges.concat(tpl.command.publish.ignoreChanges);
    (0, array_hyper_unique_1.array_unique_overwrite)(current.command.publish.ignoreChanges);
    return current;
}
exports._fixLernaJsonCore = _fixLernaJsonCore;
function _fixLernaJson(options) {
    const file = (0, path_1.resolve)(options.rootData.root, 'lerna.json');
    if ((0, fs_extra_1.existsSync)(file)) {
        let json = (0, fs_extra_1.readJSONSync)(file);
        let json2 = (0, fs_extra_1.readJSONSync)((0, path_1.resolve)(__root_1.__STATIC_ROOT, 'file/lerna.json.tpl'));
        json = _fixLernaJsonCore(json, json2);
        (0, write_package_json_1.writePackageJSONSync)(file, json);
    }
}
exports._fixLernaJson = _fixLernaJson;
//# sourceMappingURL=lerna.js.map