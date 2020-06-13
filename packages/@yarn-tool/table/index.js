"use strict";
/**
 * Created by user on 2020/6/11.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = exports.CliTable = void 0;
const cli_table3_1 = __importDefault(require("cli-table3"));
exports.CliTable = cli_table3_1.default;
exports.Table = cli_table3_1.default;
__exportStar(require("./lib/types"), exports);
__exportStar(require("./lib/deps-table"), exports);
__exportStar(require("./lib/core"), exports);
__exportStar(require("./lib/style"), exports);
exports.default = cli_table3_1.default;
//# sourceMappingURL=index.js.map