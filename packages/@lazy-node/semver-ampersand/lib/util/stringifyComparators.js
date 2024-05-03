"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyComparators = stringifyComparators;
exports.stringifyComparatorsSet = stringifyComparatorsSet;
const const_1 = require("../const");
function stringifyComparators(comparatorsArray) {
    return comparatorsArray.join(' ');
}
function stringifyComparatorsSet(comparatorsSet) {
    return comparatorsSet
        .map(stringifyComparators)
        .join(const_1.separatorDoubleVerticalBar);
}
//# sourceMappingURL=stringifyComparators.js.map