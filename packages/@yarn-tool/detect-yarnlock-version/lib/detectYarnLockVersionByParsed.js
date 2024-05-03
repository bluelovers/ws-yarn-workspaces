"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersionByParsed = detectYarnLockVersionByParsed;
function detectYarnLockVersionByParsed(parsedObject) {
    if (parsedObject.verType && 'meta' in parsedObject && 'data' in parsedObject) {
        return parsedObject.verType;
    }
}
//# sourceMappingURL=detectYarnLockVersionByParsed.js.map