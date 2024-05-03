"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsDependencies = existsDependencies;
function existsDependencies(name, pkg) {
    var _a, _b, _c, _d, _e;
    return (_d = (_b = (_a = pkg.dependencies) === null || _a === void 0 ? void 0 : _a[name]) !== null && _b !== void 0 ? _b : (_c = pkg.devDependencies) === null || _c === void 0 ? void 0 : _c[name]) !== null && _d !== void 0 ? _d : (_e = pkg.optionalDependencies) === null || _e === void 0 ? void 0 : _e[name];
}
//# sourceMappingURL=existsDependencies.js.map