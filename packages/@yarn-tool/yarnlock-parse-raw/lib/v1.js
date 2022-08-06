"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyYarnLockRawV1 = exports.parseYarnLockRawV1Root = exports.parseYarnLockRawV1 = void 0;
const lockfile_1 = require("@yarnpkg/lockfile");
function parseYarnLockRawV1(source, fileLoc) {
    return (0, lockfile_1.parse)(source === null || source === void 0 ? void 0 : source.toString(), fileLoc);
}
exports.parseYarnLockRawV1 = parseYarnLockRawV1;
function parseYarnLockRawV1Root(source, fileLoc) {
    return parseYarnLockRawV1(source, fileLoc).object;
}
exports.parseYarnLockRawV1Root = parseYarnLockRawV1Root;
function stringifyYarnLockRawV1(json) {
    var _a;
    return (0, lockfile_1.stringify)((_a = json.object) !== null && _a !== void 0 ? _a : json);
}
exports.stringifyYarnLockRawV1 = stringifyYarnLockRawV1;
//# sourceMappingURL=v1.js.map