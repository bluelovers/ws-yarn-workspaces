"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyComparatorsSet = exports.stringifyComparators = void 0;
const const_1 = require("../const");
function stringifyComparators(comparators) {
    return comparators.join(' ');
}
exports.stringifyComparators = stringifyComparators;
function stringifyComparatorsSet(comparators) {
    return comparators
        .map(stringifyComparators)
        .join(const_1.separatorDoubleVerticalBar);
}
exports.stringifyComparatorsSet = stringifyComparatorsSet;
//# sourceMappingURL=stringifyComparators.js.map