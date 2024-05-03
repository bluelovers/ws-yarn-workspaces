"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertScopePath = assertScopePath;
const upath2_1 = require("upath2");
const path_in_dir_1 = require("path-in-dir");
function assertScopePath(scope, __root) {
    if (!(scope === null || scope === void 0 ? void 0 : scope.length)) {
        throw new Error(`Invalid scope: ${scope}`);
    }
    const __dir = (0, upath2_1.resolve)(__root, scope);
    if (!(0, path_in_dir_1.pathInsideDirectory)(__dir, __root)) {
        throw new Error(`Invalid path: ${__dir}`);
    }
}
//# sourceMappingURL=check-scope.js.map