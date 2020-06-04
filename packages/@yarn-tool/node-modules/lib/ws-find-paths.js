"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsFindPackageHasModules = void 0;
const find_paths_1 = __importDefault(require("./find-paths"));
const listable_1 = __importDefault(require("ws-pkg-list/lib/listable"));
function wsFindPackageHasModules(cwd, dir) {
    return listable_1.default(cwd)
        .map(row => {
        let modules = find_paths_1.default(row.location, dir).modules;
        return {
            ...row,
            modules,
        };
    })
        .filter(data => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.modules) === null || _a === void 0 ? void 0 : _a.length; });
}
exports.wsFindPackageHasModules = wsFindPackageHasModules;
exports.default = wsFindPackageHasModules;
//# sourceMappingURL=ws-find-paths.js.map