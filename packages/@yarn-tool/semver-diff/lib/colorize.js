"use strict";
/**
 * 顏色差異顯示模組 / Colorized version difference module
 *
 * Created by user on 2020/6/11.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorizeDiff = colorizeDiff;
const debug_color2_1 = require("debug-color2");
const core_1 = require("./core");
/**
 * 顏色差異顯示的入口函式
 * Entry point for colorized version differences
 *
 * 呼叫端若已提供 chalk 或要求 stripAnsi，就直接走核心邏輯，
 * 省去從 console 推導 chalk 的步驟；否則以 debug-color2 的
 * chalkByConsole 取得與該 console 一致的著色能力。
 * When the caller supplies chalk or asks for stripAnsi, the core runs directly
 * and the step of deriving chalk from a console is skipped; otherwise chalk is
 * resolved through debug-color2's chalkByConsole so coloring matches that
 * console's settings.
 *
 * @param from - 舊版本字串 / Old version string
 * @param to - 新版本字串 / New version string
 * @param options - 顯示選項 / Display options
 * @returns 帶顏色的差異顯示字串 / Colorized difference string
 *
 * @example
 * ```typescript
 * colorizeDiff('1.2.3', '1.3.0'); // '1.3.0'（'3.0' 為青色 / cyan）
 * colorizeDiff('1.2.3', '1.3.0', { stripAnsi: true }); // '1.3.0'
 * ```
 */
function colorizeDiff(from, to, options) {
    var _a;
    /**
     * 已有 chalk（可直接著色）或明確要求純文字時，
     * 不需要再從 console 取 chalk。
     * With chalk available (coloring possible) or plain text explicitly
     * requested, there is no need to resolve chalk from a console.
     */
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
//# sourceMappingURL=colorize.js.map