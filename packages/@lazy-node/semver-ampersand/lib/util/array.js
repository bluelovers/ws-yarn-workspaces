"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_sub_map = void 0;
function array_sub_map(listSet, callbackFn, thisArg) {
    return listSet
        .map((list) => {
        return list.map(callbackFn, thisArg);
    });
}
exports.array_sub_map = array_sub_map;
//# sourceMappingURL=array.js.map