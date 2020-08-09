"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOSTempPath = void 0;
const os_1 = require("os");
/**
 * get os temp dir
 */
function findOSTempPath(cwd) {
    return os_1.tmpdir();
}
exports.findOSTempPath = findOSTempPath;
//# sourceMappingURL=findOSTempPath.js.map