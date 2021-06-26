"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.handleAmpersandAndSpaces = exports.simplifyRange = exports.validRange = exports.minSatisfying = exports.maxSatisfying = exports.satisfies = exports.reAmpersandAndSpaces = void 0;
const simplifyRange_1 = require("./lib/simplifyRange");
Object.defineProperty(exports, "simplifyRange", { enumerable: true, get: function () { return simplifyRange_1.simplifyRange; } });
const handleAmpersandAndSpaces_1 = require("./lib/handleAmpersandAndSpaces");
Object.defineProperty(exports, "handleAmpersandAndSpaces", { enumerable: true, get: function () { return handleAmpersandAndSpaces_1.handleAmpersandAndSpaces; } });
const satisfies_1 = require("./lib/satisfies");
Object.defineProperty(exports, "satisfies", { enumerable: true, get: function () { return satisfies_1.satisfies; } });
const maxSatisfying_1 = require("./lib/maxSatisfying");
Object.defineProperty(exports, "maxSatisfying", { enumerable: true, get: function () { return maxSatisfying_1.maxSatisfying; } });
const minSatisfying_1 = require("./lib/minSatisfying");
Object.defineProperty(exports, "minSatisfying", { enumerable: true, get: function () { return minSatisfying_1.minSatisfying; } });
const validRange_1 = require("./lib/validRange");
Object.defineProperty(exports, "validRange", { enumerable: true, get: function () { return validRange_1.validRange; } });
const Range_1 = require("./lib/Range");
Object.defineProperty(exports, "Range", { enumerable: true, get: function () { return Range_1.Range; } });
var const_1 = require("./lib/const");
Object.defineProperty(exports, "reAmpersandAndSpaces", { enumerable: true, get: function () { return const_1.reAmpersandAndSpaces; } });
exports.default = {
    satisfies: satisfies_1.satisfies,
    maxSatisfying: maxSatisfying_1.maxSatisfying,
    minSatisfying: minSatisfying_1.minSatisfying,
    validRange: validRange_1.validRange,
    simplifyRange: simplifyRange_1.simplifyRange,
    handleAmpersandAndSpaces: handleAmpersandAndSpaces_1.handleAmpersandAndSpaces,
    Range: Range_1.Range,
};
//# sourceMappingURL=index.js.map