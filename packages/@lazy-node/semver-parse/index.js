"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyRange = exports.stringifyFull = exports.stringify = exports.parseRange = exports.parse = void 0;
const tslib_1 = require("tslib");
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
(0, tslib_1.__exportStar)(require("./lib/checker"), exports);
exports.default = stringifySimpleSemVerRange_1.stringifySimpleSemVerRange;
//# sourceMappingURL=index.js.map