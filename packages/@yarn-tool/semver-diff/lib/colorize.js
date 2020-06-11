"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorizeDiff = void 0;
const debug_color2_1 = require("debug-color2");
const core_1 = require("./core");
function colorizeDiff(from, to, options) {
    if (options.chalk) {
        return core_1.colorizeDiffCore(from, to, options);
    }
    return debug_color2_1.chalkByConsole((chalk) => {
        return core_1.colorizeDiffCore(from, to, {
            ...options,
            // @ts-ignore
            chalk,
        });
    }, options.console);
}
exports.colorizeDiff = colorizeDiff;
//# sourceMappingURL=colorize.js.map