"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPaths = exports.EnumCheckPaths = void 0;
const tslib_1 = require("tslib");
const path_dir_normalize_1 = tslib_1.__importDefault(require("path-dir-normalize"));
var EnumCheckPaths;
(function (EnumCheckPaths) {
    EnumCheckPaths[EnumCheckPaths["root"] = 1] = "root";
    EnumCheckPaths[EnumCheckPaths["rootPath"] = 0] = "rootPath";
    EnumCheckPaths[EnumCheckPaths["failed"] = -1] = "failed";
})(EnumCheckPaths = exports.EnumCheckPaths || (exports.EnumCheckPaths = {}));
function checkPaths(input, options) {
    let { root, rootPath } = input;
    if ((root === null || root === void 0 ? void 0 : root.length) && (rootPath === null || rootPath === void 0 ? void 0 : rootPath.length)) {
        root = (0, path_dir_normalize_1.default)(root);
        rootPath = (0, path_dir_normalize_1.default)(rootPath);
        if (root !== rootPath) {
            if (rootPath.indexOf(root) === 0) {
                return 1 /* EnumCheckPaths.root */;
            }
            else if (!(options === null || options === void 0 ? void 0 : options.skipStrictCheck)) {
                return -1 /* EnumCheckPaths.failed */;
            }
        }
        return 0 /* EnumCheckPaths.rootPath */;
    }
    else if (rootPath === null || rootPath === void 0 ? void 0 : rootPath.length) {
        return 0 /* EnumCheckPaths.rootPath */;
    }
    return -1 /* EnumCheckPaths.failed */;
}
exports.checkPaths = checkPaths;
//# sourceMappingURL=util.js.map