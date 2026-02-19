"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWin = exports.__ROOT_WS = void 0;
const path_1 = require("path");
exports.__ROOT_WS = (0, path_1.join)(__dirname);
exports.isWin = process.platform === "win32";
//# sourceMappingURL=__root_ws.js.map