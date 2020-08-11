"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSemverRange = void 0;
const SimpleSemVer_1 = require("./SimpleSemVer");
const const_1 = require("./const");
function parseSemverRange(str) {
    let m;
    const arr = [];
    while (m = const_1.reSemverRange.exec(str)) {
        let obj = {
            semver: m[3],
            operator: (m[4] || m[2]),
            major: m[6],
            minor: m[8],
            patch: m[10],
        };
        if ("+" /* build */ === m[12]) {
            obj.build = m[13];
        }
        if ("-" /* release */ === m[12]) {
            obj.release = m[13];
        }
        arr.push(new SimpleSemVer_1.SimpleSemVer(obj));
    }
    return arr;
}
exports.parseSemverRange = parseSemverRange;
exports.default = parseSemverRange;
//# sourceMappingURL=parseSemverRange.js.map