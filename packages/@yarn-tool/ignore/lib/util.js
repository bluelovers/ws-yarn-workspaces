"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._readonlyArrayToMutable = _readonlyArrayToMutable;
exports._handleValueOrArrayCore = _handleValueOrArrayCore;
exports._handleValueOrArrayToMutable = _handleValueOrArrayToMutable;
const is_array_1 = require("@ts-type/is-array");
function _readonlyArrayToMutable(array) {
    if (typeof array.splice !== 'function') {
        array = [...array];
    }
    return array;
}
function _handleValueOrArrayCore(patterns) {
    if (patterns.length || typeof patterns !== 'string' && patterns[Symbol.iterator]) {
        if (!(0, is_array_1.isArray)(patterns)) {
            if (typeof patterns === 'string') {
                patterns = [patterns];
            }
            else {
                patterns = [...patterns];
            }
        }
        return patterns;
    }
    return [];
}
function _handleValueOrArrayToMutable(patterns) {
    return _readonlyArrayToMutable(_handleValueOrArrayCore(patterns));
}
//# sourceMappingURL=util.js.map