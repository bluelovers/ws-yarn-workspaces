"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyYarnLockRawV2 = exports.parseYarnLockRawV2Root = exports.parseYarnLockRawV2 = void 0;
const parsers_1 = require("@yarnpkg/parsers");
Object.defineProperty(exports, "stringifyYarnLockRawV2", { enumerable: true, get: function () { return parsers_1.stringifySyml; } });
function parseYarnLockRawV2(source) {
    return (0, parsers_1.parseSyml)(source === null || source === void 0 ? void 0 : source.toString());
}
exports.parseYarnLockRawV2 = parseYarnLockRawV2;
exports.parseYarnLockRawV2Root = parseYarnLockRawV2;
//# sourceMappingURL=v2.js.map