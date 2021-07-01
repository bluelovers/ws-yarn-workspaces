"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAny = exports.isNullSet = void 0;
function isNullSet(c) {
    return c.value === '<0.0.0-0';
}
exports.isNullSet = isNullSet;
function isAny(c) {
    return c.value === '';
}
exports.isAny = isAny;
//# sourceMappingURL=detect.js.map