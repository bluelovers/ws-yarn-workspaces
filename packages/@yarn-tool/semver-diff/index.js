"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Created by user on 2020/6/11.
 */
const colorize_1 = require("./lib/colorize");
tslib_1.__exportStar(require("./lib/types"), exports);
tslib_1.__exportStar(require("./lib/colorize"), exports);
tslib_1.__exportStar(require("./lib/core"), exports);
exports.default = colorize_1.colorizeDiff;
//# sourceMappingURL=index.js.map