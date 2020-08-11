"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyRange = exports.stringify = exports.parseRange = exports.parse = void 0;
// TODO break these down into escaped strings with meaningful comments and create using new RegExp()
//               |optional 'v'
//               | | 3 segment version
//               | |                    |optional release prefixed by '-'
//               | |                    |                                        |optional build prefixed by '+'
const stringifySemver_1 = require("./lib/stringifySemver");
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return stringifySemver_1.stringifySemver; } });
const stringifySemverRange_1 = require("./lib/stringifySemverRange");
Object.defineProperty(exports, "stringifyRange", { enumerable: true, get: function () { return stringifySemverRange_1.stringifySemverRange; } });
const parseSemverRange_1 = require("./lib/parseSemverRange");
Object.defineProperty(exports, "parseRange", { enumerable: true, get: function () { return parseSemverRange_1.parseSemverRange; } });
const parseSemver_1 = require("./lib/parseSemver");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parseSemver_1.parseSemver; } });
//# sourceMappingURL=index.js.map