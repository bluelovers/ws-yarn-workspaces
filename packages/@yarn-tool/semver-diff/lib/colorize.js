"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorizeDiff = void 0;
const debug_color2_1 = require("debug-color2");
const core_1 = require("./core");
function colorizeDiff(from, to, options) {
    var _a;
    if ((options === null || options === void 0 ? void 0 : options.chalk) || (options === null || options === void 0 ? void 0 : options.stripAnsi)) {
        return (0, core_1.colorizeDiffCore)(from, to, options);
    }
    return (0, debug_color2_1.chalkByConsole)((chalk) => {
        return (0, core_1.colorizeDiffCore)(from, to, {
            ...options,
            // @ts-ignore
            chalk,
        });
    }, (_a = options === null || options === void 0 ? void 0 : options.console) !== null && _a !== void 0 ? _a : debug_color2_1.console);
}
exports.colorizeDiff = colorizeDiff;
//# sourceMappingURL=colorize.js.map