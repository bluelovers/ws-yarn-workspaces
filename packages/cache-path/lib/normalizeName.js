"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeName = void 0;
const hash_sum_1 = __importDefault(require("hash-sum"));
/**
 * normalize cache name
 */
function normalizeName(name, hash) {
    if (hash) {
        if (typeof hash === 'function') {
            return hash(name);
        }
        return hash_sum_1.default(name);
    }
    return name
        .trim()
        .replace(/[^\w\-\.]/g, '_')
        .replace(/\.+/g, '_')
        .replace(/_+/g, '_');
}
exports.normalizeName = normalizeName;
//# sourceMappingURL=normalizeName.js.map