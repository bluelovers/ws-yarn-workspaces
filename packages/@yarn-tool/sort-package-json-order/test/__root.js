"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWin = exports.__ROOT = void 0;
const path_1 = require("path");
exports.__ROOT = (0, path_1.join)(__dirname, '..');
exports.isWin = process.platform === "win32";
//# sourceMappingURL=__root.js.map