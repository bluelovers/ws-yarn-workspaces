"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newYarnLockParsedVersionError = newYarnLockParsedVersionError;
function newYarnLockParsedVersionError(msg) {
    return new TypeError(msg !== null && msg !== void 0 ? msg : 'can\'t detect yarn.lock version');
}
exports.default = newYarnLockParsedVersionError;
//# sourceMappingURL=index.js.map