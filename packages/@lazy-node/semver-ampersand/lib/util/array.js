"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_sub_map = array_sub_map;
/**
 * 對二維陣列的「內層」逐一套用回呼
 * Apply a callback to each inner array of a two-dimensional array
 *
 * 與單純的 map 差別在於 thisArg 會傳給內層的 map，
 * 讓呼叫端能綁定方法所需的 this。
 * Unlike a plain map, `thisArg` is forwarded to the inner maps so callers can
 * bind the `this` a method expects.
 *
 * @param listSet - 二維陣列 / Two-dimensional array
 * @param callbackFn - 內層回呼 / Callback applied to each inner array
 * @param thisArg - 回呼的 this / `this` for the callback
 * @returns 新的二維陣列 / A new two-dimensional array
 */
function array_sub_map(listSet, callbackFn, thisArg) {
    return listSet
        .map((list) => {
        return list.map(callbackFn, thisArg);
    });
}
//# sourceMappingURL=array.js.map