"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersionByParsed = void 0;
function detectYarnLockVersionByParsed(parsedObject) {
    if (parsedObject.verType && 'meta' in parsedObject && 'data' in parsedObject) {
        return parsedObject.verType;
    }
}
exports.detectYarnLockVersionByParsed = detectYarnLockVersionByParsed;
//# sourceMappingURL=detectYarnLockVersionByParsed.js.map