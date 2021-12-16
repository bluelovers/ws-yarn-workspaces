"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pkg_1 = require("./lib/pkg");
tslib_1.__exportStar(require("./lib/core"), exports);
tslib_1.__exportStar(require("./lib/ws"), exports);
tslib_1.__exportStar(require("./lib/pkg"), exports);
exports.default = pkg_1.checkPkgDir;
//# sourceMappingURL=index.js.map