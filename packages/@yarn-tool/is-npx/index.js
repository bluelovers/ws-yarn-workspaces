"use strict";
/**
 * Created by user on 2019/7/19.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNpx = isNpx;
const tslib_1 = require("tslib");
const is_npx_1 = tslib_1.__importDefault(require("is-npx"));
function isNpx(data) {
    const { __dirname = '' } = data;
    return ((0, is_npx_1.default)() || __dirname.includes('_npx'));
}
exports.default = isNpx;
//# sourceMappingURL=index.js.map