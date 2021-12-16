"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYarnLockRowV2 = exports.parseYarnLockRowV1 = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./lib/types"), exports);
const parseYarnLockRowV1_1 = require("./lib/v1/parseYarnLockRowV1");
Object.defineProperty(exports, "parseYarnLockRowV1", { enumerable: true, get: function () { return parseYarnLockRowV1_1.parseYarnLockRowV1; } });
const parseYarnLockRowV2_1 = require("./lib/v2/parseYarnLockRowV2");
Object.defineProperty(exports, "parseYarnLockRowV2", { enumerable: true, get: function () { return parseYarnLockRowV2_1.parseYarnLockRowV2; } });
exports.default = exports;
//# sourceMappingURL=index.js.map