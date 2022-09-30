"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixTsdxPackage = void 0;
const dot_values2_1 = require("dot-values2");
function fixTsdxPackage(pkg, config) {
    var _a, _b, _c, _d, _e;
    var _f, _g;
    if (config.rootData.hasWorkspace && !config.rootData.isWorkspace) {
        (0, dot_values2_1.deleteValue)(pkg, ['dependencies', 'tslib']);
        (0, dot_values2_1.deleteValue)(pkg, ['devDependencies', 'tslib']);
    }
    else {
        (_a = pkg.devDependencies) !== null && _a !== void 0 ? _a : (pkg.devDependencies = {});
        if (((_c = (_b = pkg.dependencies) === null || _b === void 0 ? void 0 : _b['tslib']) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            (_d = (_f = pkg.devDependencies)['tslib']) !== null && _d !== void 0 ? _d : (_f['tslib'] = pkg.dependencies['tslib']);
            (0, dot_values2_1.deleteValue)(pkg, ['dependencies', 'tslib']);
        }
        if (config.rootData.isRoot) {
            (_e = (_g = pkg.devDependencies)['@bluelovers/tsconfig']) !== null && _e !== void 0 ? _e : (_g['@bluelovers/tsconfig'] = '*');
        }
    }
    return pkg;
}
exports.fixTsdxPackage = fixTsdxPackage;
//# sourceMappingURL=fix.js.map