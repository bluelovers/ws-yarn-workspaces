"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._diffArray = void 0;
const formatVersion_1 = require("./formatVersion");
function _diffArray(array, chalk) {
    const item = array.item;
    switch (item.kind) {
        case "N":
            return [`[...]`, `[..., ${chalk.green(formatVersion_1._formatVersion(item.rhs))}]`];
        case "D":
            return [`[..., ${chalk.red(formatVersion_1._formatVersion(item.lhs))}]`, `[...]`];
        case "E":
            return [
                `[..., ${chalk.yellow(formatVersion_1._formatVersion(item.lhs))}]`,
                `[..., ${chalk.yellow(formatVersion_1._formatVersion(item.rhs))}]`,
            ];
        default:
            return [`[...]`, `[...]`];
    }
}
exports._diffArray = _diffArray;
//# sourceMappingURL=diffArray002.js.map