"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersionByObject = void 0;
const tslib_1 = require("tslib");
(0, tslib_1.__exportStar)(require("./lib/detectYarnLockVersion"), exports);
(0, tslib_1.__exportStar)(require("./lib/detectYarnLockVersionByFile"), exports);
var detectYarnLockVersionByObject_1 = require("./lib/detectYarnLockVersionByObject");
Object.defineProperty(exports, "detectYarnLockVersionByObject", { enumerable: true, get: function () { return detectYarnLockVersionByObject_1.detectYarnLockVersionByObject; } });
(0, tslib_1.__exportStar)(require("./lib/types"), exports);
const detectYarnLockVersion_1 = require("./lib/detectYarnLockVersion");
exports.default = detectYarnLockVersion_1.detectYarnLockVersion;
//# sourceMappingURL=index.js.map