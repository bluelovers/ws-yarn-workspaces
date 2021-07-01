"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyComparatorsSet = exports.stringifyComparators = void 0;
const const_1 = require("../const");
function stringifyComparators(comparatorsArray) {
    return comparatorsArray.join(' ');
}
exports.stringifyComparators = stringifyComparators;
function stringifyComparatorsSet(comparatorsSet) {
    return comparatorsSet
        .map(stringifyComparators)
        .join(const_1.separatorDoubleVerticalBar);
}
exports.stringifyComparatorsSet = stringifyComparatorsSet;
//# sourceMappingURL=stringifyComparators.js.map