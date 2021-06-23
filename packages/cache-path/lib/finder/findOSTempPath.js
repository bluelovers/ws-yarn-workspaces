"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOSTempPath = void 0;
const os_1 = require("os");
/**
 * get os temp dir
 */
function findOSTempPath(cwd, processEnv = process.env) {
    return (0, os_1.tmpdir)();
}
exports.findOSTempPath = findOSTempPath;
//# sourceMappingURL=findOSTempPath.js.map