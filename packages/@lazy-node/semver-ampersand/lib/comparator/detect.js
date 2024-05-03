"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNullSet = isNullSet;
exports.isAny = isAny;
function isNullSet(c) {
    return c.value === "<0.0.0-0" /* EnumSemverVersion.NULL */;
}
function isAny(c) {
    return c.value === "" /* EnumSemverVersion.ANY */;
}
//# sourceMappingURL=detect.js.map