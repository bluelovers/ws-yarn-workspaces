"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._diffArray = _diffArray;
const formatVersion_1 = require("./formatVersion");
/**
 * @deprecated
 */
function _diffArray(array) {
    const item = array.item;
    switch (item.kind) {
        case "N" /* EnumKinds.DiffNew */:
            return [`[...]`, `[..., ${(0, formatVersion_1._formatVersion)(item.rhs)}]`];
        case "D" /* EnumKinds.DiffDeleted */:
            return [`[..., ${(0, formatVersion_1._formatVersion)(item.lhs)}]`, `[...]`];
        case "E" /* EnumKinds.DiffEdit */:
            return [
                `[...], ${(0, formatVersion_1._formatVersion)(item.lhs)}]`,
                `[..., ${(0, formatVersion_1._formatVersion)(item.lhs)}]`,
            ];
        default:
            return [`[...]`, `[...]`];
    }
}
//# sourceMappingURL=diffArray001.js.map