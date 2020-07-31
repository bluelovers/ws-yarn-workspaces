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
exports.detectYarnLockVersionByObject = void 0;
__exportStar(require("./lib/detectYarnLockVersion"), exports);
__exportStar(require("./lib/detectYarnLockVersionByFile"), exports);
var detectYarnLockVersionByObject_1 = require("./lib/detectYarnLockVersionByObject");
Object.defineProperty(exports, "detectYarnLockVersionByObject", { enumerable: true, get: function () { return detectYarnLockVersionByObject_1.detectYarnLockVersionByObject; } });
__exportStar(require("./lib/types"), exports);
const detectYarnLockVersion_1 = require("./lib/detectYarnLockVersion");
exports.default = detectYarnLockVersion_1.detectYarnLockVersion;
//# sourceMappingURL=index.js.map