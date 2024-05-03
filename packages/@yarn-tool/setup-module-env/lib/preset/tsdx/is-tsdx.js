"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTsdxPackage = isTsdxPackage;
function isTsdxPackage(pkg, config) {
    var _a, _b;
    return ((_a = pkg.keywords) === null || _a === void 0 ? void 0 : _a.includes("create-by-tsdx" /* EnumTsdx.keyword */)) && typeof ((_b = pkg.exports) === null || _b === void 0 ? void 0 : _b['.']) === 'object';
}
//# sourceMappingURL=is-tsdx.js.map