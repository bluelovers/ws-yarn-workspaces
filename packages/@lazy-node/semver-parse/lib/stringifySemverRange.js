"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifySemverRange = void 0;
const checker_1 = require("./checker");
const SimpleSemVer_1 = require("./SimpleSemVer");
const stringifySemver_1 = require("./stringifySemver");
function stringifySemverRange(arr) {
    return arr.reduce((a, ver) => {
        var _a;
        if (checker_1.isSimpleSemVerOperatorLike(ver)) {
            a.push(ver.operator);
        }
        else if (checker_1.isSimpleSemVerObjectLike(ver)) {
            let str = (_a = ver.operator) !== null && _a !== void 0 ? _a : '';
            if (ver instanceof SimpleSemVer_1.SimpleSemVer) {
                str += ver.toString();
            }
            else {
                str += stringifySemver_1.stringifySemver(ver);
            }
            a.push(str);
        }
        else {
            throw new TypeError(`obj not a ISimpleSemVerLike`);
        }
        return a;
    }, []).join(' ');
}
exports.stringifySemverRange = stringifySemverRange;
exports.default = stringifySemverRange;
//# sourceMappingURL=stringifySemverRange.js.map