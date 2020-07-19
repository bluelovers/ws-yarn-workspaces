"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNpmPackageName = void 0;
const validateNpmPackageName_1 = require("./lib/validateNpmPackageName");
Object.defineProperty(exports, "validateNpmPackageName", { enumerable: true, get: function () { return validateNpmPackageName_1.validateNpmPackageName; } });
__exportStar(require("./lib/types"), exports);
exports.default = validateNpmPackageName_1.validateNpmPackageName;
//# sourceMappingURL=index.js.map