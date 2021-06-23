"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._diffArray = void 0;
const formatVersion_1 = require("./formatVersion");
/**
 * @deprecated
 */
function _diffArray(array) {
    const item = array.item;
    switch (item.kind) {
        case "N" /* DiffNew */:
            return [`[...]`, `[..., ${(0, formatVersion_1._formatVersion)(item.rhs)}]`];
        case "D" /* DiffDeleted */:
            return [`[..., ${(0, formatVersion_1._formatVersion)(item.lhs)}]`, `[...]`];
        case "E" /* DiffEdit */:
            return [
                `[...], ${(0, formatVersion_1._formatVersion)(item.lhs)}]`,
                `[..., ${(0, formatVersion_1._formatVersion)(item.lhs)}]`,
            ];
        default:
            return [`[...]`, `[...]`];
    }
}
exports._diffArray = _diffArray;
//# sourceMappingURL=diffArray001.js.map