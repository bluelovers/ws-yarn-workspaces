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
exports.parseYarnLockRowV2 = exports.parseYarnLockRowV1 = void 0;
__exportStar(require("./lib/types"), exports);
const parseYarnLockRowV1_1 = require("./lib/v1/parseYarnLockRowV1");
Object.defineProperty(exports, "parseYarnLockRowV1", { enumerable: true, get: function () { return parseYarnLockRowV1_1.parseYarnLockRowV1; } });
const parseYarnLockRowV2_1 = require("./lib/v2/parseYarnLockRowV2");
Object.defineProperty(exports, "parseYarnLockRowV2", { enumerable: true, get: function () { return parseYarnLockRowV2_1.parseYarnLockRowV2; } });
exports.default = exports;
//# sourceMappingURL=index.js.map