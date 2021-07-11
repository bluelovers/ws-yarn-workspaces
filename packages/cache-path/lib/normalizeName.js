"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeName = void 0;
const tslib_1 = require("tslib");
const hash_sum_1 = (0, tslib_1.__importDefault)(require("hash-sum"));
/**
 * normalize cache name
 */
function normalizeName(name, hash) {
    if (hash) {
        if (typeof hash === 'function') {
            return hash(name);
        }
        return (0, hash_sum_1.default)(name);
    }
    const normalized = name
        .trim()
        .replace(/[^\w\-\.]/g, '_')
        .replace(/\.+/g, '_')
        .replace(/_+/g, '_');
    if (!/[^_]/.test(normalized)) {
        throw new Error(`unsafe normalizeName { ${name} => ${normalized} }`);
    }
    return normalized;
}
exports.normalizeName = normalizeName;
//# sourceMappingURL=normalizeName.js.map