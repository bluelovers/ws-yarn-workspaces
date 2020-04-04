"use strict";
/**
 * Created by user on 2019/7/19.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNpx = void 0;
const is_npx_1 = __importDefault(require("is-npx"));
function isNpx(data) {
    const { __dirname = '' } = data;
    return (is_npx_1.default() || __dirname.includes('_npx'));
}
exports.isNpx = isNpx;
exports.default = isNpx;
//# sourceMappingURL=index.js.map