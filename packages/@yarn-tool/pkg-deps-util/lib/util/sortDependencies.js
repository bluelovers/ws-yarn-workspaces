"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortDependencies = sortDependencies;
const tslib_1 = require("tslib");
const core_1 = tslib_1.__importDefault(require("sort-object-keys2/core"));
/**
 * 對四個依賴欄位依鍵名排序 (Sort the four dependency fields by key)
 *
 * Sort the four dependency fields of a package.json by key.
 *
 * @param pkg 要排序的 package.json 物件 (The package.json object to sort)
 *
 * @returns 回傳同一個 `pkg` 物件（就地修改），方便鏈式呼叫
 *
 * Returns the same `pkg` object (mutated in place) for convenient chaining.
 */
function sortDependencies(pkg) {
    var _a, _b, _c, _d;
    /**
     * `useSource`：直接在原物件上排序，避免回傳副本導致呼叫端拿到未排序的舊物件
     *
     * `useSource` sorts in place so callers are not left holding an unsorted copy.
     */
    let opts = {
        useSource: true,
    };
    /**
     * 逐一處理四種依賴欄位；欄位不存在時傳入空物件，讓排序行為一致且不拋錯
     *
     * Each of the four fields is sorted; a missing field gets an empty object so
     * behaviour stays uniform without throwing.
     */
    (0, core_1.default)((_a = pkg.dependencies) !== null && _a !== void 0 ? _a : {}, opts);
    (0, core_1.default)((_b = pkg.devDependencies) !== null && _b !== void 0 ? _b : {}, opts);
    (0, core_1.default)((_c = pkg.peerDependencies) !== null && _c !== void 0 ? _c : {}, opts);
    (0, core_1.default)((_d = pkg.optionalDependencies) !== null && _d !== void 0 ? _d : {}, opts);
    return pkg;
}
//# sourceMappingURL=sortDependencies.js.map