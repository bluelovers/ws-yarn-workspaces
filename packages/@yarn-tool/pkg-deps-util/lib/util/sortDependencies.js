"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortDependencies = void 0;
const core_1 = __importDefault(require("sort-object-keys2/core"));
function sortDependencies(pkg) {
    var _a, _b, _c, _d;
    let opts = {
        useSource: true,
    };
    core_1.default((_a = pkg.dependencies) !== null && _a !== void 0 ? _a : {}, opts);
    core_1.default((_b = pkg.devDependencies) !== null && _b !== void 0 ? _b : {}, opts);
    core_1.default((_c = pkg.peerDependencies) !== null && _c !== void 0 ? _c : {}, opts);
    core_1.default((_d = pkg.optionalDependencies) !== null && _d !== void 0 ? _d : {}, opts);
    return pkg;
}
exports.sortDependencies = sortDependencies;
//# sourceMappingURL=sortDependencies.js.map