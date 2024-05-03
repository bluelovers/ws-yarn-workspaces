"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_sub_map = array_sub_map;
function array_sub_map(listSet, callbackFn, thisArg) {
    return listSet
        .map((list) => {
        return list.map(callbackFn, thisArg);
    });
}
//# sourceMappingURL=array.js.map