"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyRange = exports.stringifyFull = exports.stringify = exports.parseRange = exports.parse = void 0;
// TODO break these down into escaped strings with meaningful comments and create using new RegExp()
//               |optional 'v'
//               | | 3 segment version
//               | |                    |optional release prefixed by '-'
//               | |                    |                                        |optional build prefixed by '+'
const stringifySimpleSemVer_1 = require("./lib/stringifySimpleSemVer");
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return stringifySimpleSemVer_1.stringifySimpleSemVer; } });
Object.defineProperty(exports, "stringifyFull", { enumerable: true, get: function () { return stringifySimpleSemVer_1.stringifySemverFull; } });
const stringifySimpleSemVerRange_1 = require("./lib/stringifySimpleSemVerRange");
Object.defineProperty(exports, "stringifyRange", { enumerable: true, get: function () { return stringifySimpleSemVerRange_1.stringifySimpleSemVerRange; } });
const parseSimpleSemVerRange_1 = require("./lib/parseSimpleSemVerRange");
Object.defineProperty(exports, "parseRange", { enumerable: true, get: function () { return parseSimpleSemVerRange_1.parseSimpleSemVerRange; } });
const parseSimpleSemVer_1 = require("./lib/parseSimpleSemVer");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parseSimpleSemVer_1.parseSimpleSemVer; } });
__exportStar(require("./lib/checker"), exports);
exports.default = stringifySimpleSemVerRange_1.stringifySimpleSemVerRange;
//# sourceMappingURL=index.js.map