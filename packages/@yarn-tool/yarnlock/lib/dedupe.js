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
exports.Dedupe = void 0;
const object_1 = require("@yarn-tool/yarnlock-dedupe/object");
Object.defineProperty(exports, "Dedupe", { enumerable: true, get: function () { return object_1.yarnDedupe; } });
__exportStar(require("@yarn-tool/yarnlock-dedupe/object"), exports);
exports.default = object_1.yarnDedupe;
//# sourceMappingURL=dedupe.js.map