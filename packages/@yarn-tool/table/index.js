"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = exports.CliTable = void 0;
const tslib_1 = require("tslib");
const cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
exports.CliTable = cli_table3_1.default;
exports.Table = cli_table3_1.default;
tslib_1.__exportStar(require("./lib/types"), exports);
tslib_1.__exportStar(require("./lib/deps-table"), exports);
tslib_1.__exportStar(require("./lib/core"), exports);
tslib_1.__exportStar(require("./lib/style"), exports);
exports.default = cli_table3_1.default;
//# sourceMappingURL=index.js.map