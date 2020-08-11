"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pruned = void 0;
/**
 * Returns a new object with all of the undefined properties removed from the given object
 */
function pruned(obj, o = {}) {
    for (const key in obj) {
        if ('undefined' !== typeof obj[key]) {
            o[key] = obj[key];
        }
    }
    return o;
}
exports.pruned = pruned;
//# sourceMappingURL=pruned.js.map