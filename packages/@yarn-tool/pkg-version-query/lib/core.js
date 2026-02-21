"use strict";
/**
 * Core version query function using package-json.
 * 使用 package-json 的核心版本查詢函數。
 *
 * @module core
 *
 * 提供底層的 npm registry 查詢功能，封裝 package-json 模組。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._queryVersion = _queryVersion;
const tslib_1 = require("tslib");
const package_json_1 = tslib_1.__importDefault(require("package-json"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
function _queryVersion(packageName, options) {
    options !== null && options !== void 0 ? options : (options = {});
    return bluebird_1.default.resolve((0, package_json_1.default)(packageName, options))
        .catch(e => {
        if (options.notThrowError) {
            return;
        }
        return Promise.reject(e);
    });
}
//# sourceMappingURL=core.js.map