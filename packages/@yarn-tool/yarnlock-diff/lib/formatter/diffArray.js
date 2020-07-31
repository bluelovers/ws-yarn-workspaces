"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._diffArray = void 0;
const formatVersion_1 = require("./formatVersion");
function _diffArray(array) {
    const item = array.item;
    switch (item.kind) {
        case "N":
            return [`[...]`, `[..., ${formatVersion_1._formatVersion(item.rhs)}]`];
        case "D":
            return [`[..., ${formatVersion_1._formatVersion(item.lhs)}]`, `[...]`];
        case "E":
            return [
                `[...], ${formatVersion_1._formatVersion(item.lhs)}]`,
                `[..., ${formatVersion_1._formatVersion(item.lhs)}]`,
            ];
        default:
            return [`[...]`, `[...]`];
    }
}
exports._diffArray = _diffArray;
//# sourceMappingURL=diffArray.js.map