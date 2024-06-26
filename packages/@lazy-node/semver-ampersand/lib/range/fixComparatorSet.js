"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeAny = includeAny;
exports.optimizeComparatorSetAny = optimizeComparatorSetAny;
exports.filterRemoveNullSet = filterRemoveNullSet;
exports.fixComparatorSet = fixComparatorSet;
const detect_1 = require("../comparator/detect");
function includeAny(comparatorsArray) {
    return comparatorsArray.find(c => (0, detect_1.isAny)(c));
}
/**
 * if we have any that are `*`, then the range is just `*`
 */
function optimizeComparatorSetAny(comparatorsSet, unsafeOptimize) {
    unsafeOptimize = !!unsafeOptimize;
    for (const ca of comparatorsSet) {
        if (unsafeOptimize === true) {
            let cc = includeAny(ca);
            if (cc) {
                comparatorsSet = [[cc]];
                break;
            }
        }
        if (ca.length === 1 && (0, detect_1.isAny)(ca[0])) {
            comparatorsSet = [ca];
            break;
        }
    }
    return comparatorsSet;
}
function filterRemoveNullSet(comparatorsSet, unsafeOptimize) {
    if (unsafeOptimize) {
        return comparatorsSet.filter(ca => !ca.some(detect_1.isNullSet));
    }
    return comparatorsSet.filter(c => !(0, detect_1.isNullSet)(c[0]));
}
function fixComparatorSet(comparatorsSet, unsafeOptimize) {
    unsafeOptimize = !!unsafeOptimize;
    // if we have any that are not the null set, throw out null sets.
    if (comparatorsSet.length > 1) {
        // keep the first one, in case they're all null sets
        const first = comparatorsSet[0];
        comparatorsSet = filterRemoveNullSet(comparatorsSet, unsafeOptimize);
        if (comparatorsSet.length === 0) {
            comparatorsSet = [first];
        }
        else if (comparatorsSet.length > 1) {
            comparatorsSet = optimizeComparatorSetAny(comparatorsSet, unsafeOptimize);
        }
    }
    comparatorsSet = comparatorsSet.filter(ca => ca.length);
    return comparatorsSet;
}
//# sourceMappingURL=fixComparatorSet.js.map