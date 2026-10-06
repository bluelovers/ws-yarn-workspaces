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
    /**
     * 選項允許省略：交給 package-json 使用其預設值，
     * 避免每個呼叫端都要自行組出空物件。
     *
     * Options are optional: an empty object lets package-json apply its own defaults,
     * so callers do not have to build one themselves.
     */
    options !== null && options !== void 0 ? options : (options = {});
    return bluebird_1.default.resolve((0, package_json_1.default)(packageName, options))
        .catch(e => {
        /**
         * notThrowError 是給「寧可拿不到也不要中斷流程」的批次查詢用的；
         * 回傳 undefined 而非吞掉後回傳舊值，讓呼叫端能明確區分失敗與命中。
         *
         * notThrowError serves batch queries that prefer no result over a crash;
         * returning undefined (instead of some stale value) lets callers
         * distinguish failure from a real hit.
         */
        if (options.notThrowError) {
            return;
        }
        return Promise.reject(e);
    });
}
//# sourceMappingURL=core.js.map