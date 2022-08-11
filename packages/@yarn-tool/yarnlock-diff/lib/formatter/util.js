"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripAnsiValues = void 0;
const tslib_1 = require("tslib");
const strip_ansi_1 = tslib_1.__importDefault(require("strip-ansi"));
function stripAnsiValues(input, overwrite) {
    return Object.values(input)
        .map(arr => {
        if (overwrite) {
            arr.forEach((value, i) => {
                arr[i] = (0, strip_ansi_1.default)(value);
            });
        }
        else {
            arr = arr.map(strip_ansi_1.default);
        }
        return arr;
    });
}
exports.stripAnsiValues = stripAnsiValues;
//# sourceMappingURL=util.js.map