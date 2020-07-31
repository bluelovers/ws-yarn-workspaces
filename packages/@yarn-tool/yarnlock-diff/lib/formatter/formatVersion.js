"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._formatVersion = void 0;
function _formatVersion(rhsOrLhs) {
    switch (typeof rhsOrLhs) {
        case "string":
            return rhsOrLhs;
        case "object":
            return Array.isArray(rhsOrLhs)
                ? rhsOrLhs.join(", ")
                : JSON.stringify(rhsOrLhs);
        default:
            return `${rhsOrLhs}`;
    }
}
exports._formatVersion = _formatVersion;
//# sourceMappingURL=formatVersion.js.map